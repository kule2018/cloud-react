import React, { createRef, Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { noop, omit } from '@utils';
import ContextProvider from '@contexts/context-provider';
import Input from '../../input';
import Icon from '../../icon';
import Year from '../year/main';
import YearMonth from '../year-month/main';
import MonthDay from '../month-day/main';
import DatePicker from '../date-picker/main';
import { renderDOM, createWrapper, destroyDOM } from './utils';
import { enumObj, containerClass, selectorClass, wrapperClass, FORMAT } from '../constant';
import { transformObj, displayNow } from '../utils';

class Picker extends Component {
	static contextType = ContextProvider;

	constructor(props) {
		super(props);

		const { value, defaultValue, open, formatValue } = props;
		const defaultTime = defaultValue ? formatValue(displayNow(defaultValue), this.format) : undefined;

		this.state = {
			currentValue: value ? formatValue(displayNow(new Date(value)), this.format) : defaultTime,
			id: Math.random()
				.toString()
				.replace('.', ''),
			visible: open,
			style: {},
			prevProps: props
		};

		this.inpRef = createRef();
		this.popupRef = createRef();

		this.containerRef = createRef();
	}

	static getDerivedStateFromProps(props, prevState) {
		const { prevProps } = prevState;
		const { open } = props;
		const { open: prevOpen } = prevProps;

		if (open !== prevOpen) {
			return {
				visible: open,
				prevProps: props
			};
		}
		return null;
	}

	componentDidMount() {
		this.document.addEventListener('click', this.handleClick, false);
		if (this.props.open) {
			this.changeVisible(this.state.visible);
		}
	}

	componentDidUpdate(prevProps) {
		const { value: prevValue, open: prevOpen } = prevProps;
		const { value, open } = this.props;

		if (prevValue !== value) {
			if (value) {
				const date = displayNow(new Date(value));
				this.handleValueChange(date);
			} else {
				this.handleChange();
			}
		}
		if (prevOpen !== open) {
			this.changeVisible(open);
		}
	}

	componentWillUnmount() {
		this.document.removeEventListener('click', this.handleClick, false);
		clearTimeout(this.popupTimeout);
	}

	get format() {
		return FORMAT[this.props.tempMode];
	}

	get document() {
		return this.context.rootDocument;
	}

	get portal() {
		const { getContext } = this.context;
		return getContext() || this.document.body;
	}

	handleValueChange = (output = '', isPop = false) => {
		const value = this.props.formatValue(output);
		this.setState({
			currentValue: value
		});
		if (isPop) {
			this.props.onChange(value);
		}
	};

	onPopChange = output => {
		this.handleValueChange(output, true);
		this.changeVisible(false);
	};

	renderMainPop = () => {
		const { tempMode, formatValue } = this.props;
		const { currentValue } = this.state;
		const checkValue = currentValue ? formatValue(displayNow(new Date(currentValue)), this.format) : '';

		if (tempMode === enumObj.YEAR_MODEL) {
			return <Year {...this.props} checkValue={currentValue} onChange={this.onPopChange} />;
		}

		if (tempMode === enumObj.YEAR_MONTH_MODEL) {
			return <YearMonth {...this.props} checkValue={checkValue} onChange={this.onPopChange} />;
		}

		if (tempMode === enumObj.MONTH_DAY_MODEL) {
			return <MonthDay {...this.props} checkValue={checkValue} onChange={this.onPopChange} />;
		}

		return <DatePicker {...this.props} checkValue={transformObj(checkValue)} onChange={this.onPopChange} />;
	};

	popClick = evt => {
		evt.stopPropagation();
		if (evt.nativeEvent.stopImmediatePropagation) {
			evt.nativeEvent.stopImmediatePropagation();
		}
	};

	handleClick = e => {
		const isClickPicker = this.containerRef.current.contains(e.target) || (this.popupRef.current && this.popupRef.current.contains(e.target));

		if (!isClickPicker && this.state.visible) {
			this.changeVisible(false);
		}
	};

	changeVisible = isVisible => {
		const { containerRef } = this;
		const { id } = this.state;
		const { containerEleClass, height, isAppendToBody, className } = this.props;

		if (isVisible && id) {
			this.setState({
				visible: true
			});

			const style = this.positionPop();

			if (isAppendToBody) {
				this.setState({ style });
			} else {
				createWrapper(id, height, style);

				renderDOM(
					id,
					containerRef.current,
					<div className={`${selectorClass}-popup ${className}`} ref={this.popupRef} onClick={this.popClick}>
						{this.renderMainPop()}
					</div>
				);
			}

			if (containerEleClass) {
				// 在弹框里面，日历处于最下面，那么需要自动滚动，让日历选择面板显示出来
				this.popupTimeout = setTimeout(() => {
					const containerElement = document.querySelectorAll(`.${containerEleClass}`)[0];
					const wrapperElement = document.querySelector(`.${wrapperClass}`);
					const containerHeight = containerElement.getClientRects()[0].bottom;

					if (containerRef.current.getClientRects()[0].bottom + height > containerHeight) {
						wrapperElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
					}
				}, 0);
			}
			return;
		}

		this.setState({
			visible: false
		});
		this.props.onClose();
		destroyDOM(id, containerRef.current);
	};

	positionPop = () => {
		const { left, top, bottom, height } = this.containerRef.current.getBoundingClientRect();
		const { isAppendToBody, position, height: popupHeight } = this.props;
		const isBottomDistanceEnough = bottom + popupHeight < this.document.documentElement.clientHeight;
		const isLocationTop = popupHeight < top && !isBottomDistanceEnough && position === 'auto';
		const marginTop = isLocationTop ? '1px' : '-1px';
		if (isAppendToBody) {
			return {
				position: 'fixed',
				left: `${left}px`,
				top: isLocationTop ? `${top - popupHeight}px` : `${bottom}px`,
				marginTop
			};
		}
		return {
			top: isLocationTop ? `${-popupHeight}px` : `${height}px`,
			marginTop
		};
	};

	onClickInput = e => {
		e.stopPropagation();
		const { disabled } = this.props;
		const { visible } = this.state;

		if (disabled) return;

		// 如果不可见则显示面板
		if (!visible) {
			this.changeVisible(true);
		}
	};

	handleChange = (evt = '') => {
		if (!evt || !evt.target.value.trim().length) {
			this.props.onChange('');
			this.setState({
				currentValue: ''
			});
		}
	};

	render() {
		const { inpRef, containerRef, onClickInput, handleChange } = this;
		const { currentValue, visible, style } = this.state;
		const { placeholder, disabled, isAppendToBody, width, className, ...others } = this.props;
		const otherProps = omit(others, [
			'value',
			'containerEleClass',
			'defaultValue',
			'open',
			'format',
			'defaultTime',
			'showTimePicker',
			'min',
			'max',
			'maxYear',
			'minYear',
			'maxDate',
			'minDate',
			'tempMode',
			'formatValue',
			'integer'
		]);

		return (
			<div ref={containerRef} className={containerClass}>
				<div className={`${selectorClass}-inp-block`} onClick={onClickInput}>
					<Input
						{...otherProps}
						style={{ width: `${parseFloat(width)}px` }}
						readOnly
						hasClear
						ref={inpRef}
						value={currentValue}
						placeholder={placeholder}
						onChange={handleChange}
						disabled={disabled}
						className={`${selectorClass}-inp`}
						suffix={<Icon type="calendar" className={`${selectorClass}-inp-icon`} onClick={onClickInput} />}
					/>
				</div>

				{visible &&
					isAppendToBody &&
					ReactDOM.createPortal(
						<div className={`${selectorClass}-popup ${className}`} ref={this.popupRef} style={{ ...style }} onClick={this.popClick}>
							{this.renderMainPop()}
						</div>,
						this.portal
					)}
			</div>
		);
	}
}

Picker.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
	placeholder: PropTypes.string,
	open: PropTypes.bool,
	isAppendToBody: PropTypes.bool,
	defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]),
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]),
	formatValue: PropTypes.func,
	onChange: PropTypes.func,
	onClose: PropTypes.func
};

Picker.defaultProps = {
	className: '',
	disabled: false,
	placeholder: '',
	open: false,
	isAppendToBody: false,
	defaultValue: '',
	value: undefined,
	formatValue: noop,
	onChange: noop,
	onClose: noop
};

export default Picker;
