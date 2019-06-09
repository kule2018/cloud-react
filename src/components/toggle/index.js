import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import classes from './index.less';

class Toggle extends Component {

	handleClick = () => {

		const { checked, disabled, onChange } = this.props;

		if (disabled) {
			return;
		}

		if (onChange) {
			onChange(!checked);
		}
	}

	render() {

		const { checked, checkedText, unCheckedText, size, disabled } = this.props;

		const wrapper = classNames([classes.toggle], {
			[classes.toggleSmall]: size === 'small',
			[classes.toggleChecked]: checked,
			[classes.toggleDisabled]: disabled
		});

		return (
			<button type="button" className={wrapper} onClick={this.handleClick}>
				<span className={classes.toggleInner}>{ checked ? checkedText : unCheckedText }</span>
			</button>
		);
	}
}

Toggle.propTypes = {
	size: PropTypes.oneOf(['normal', 'small']),
	checked: PropTypes.bool,
	onChange: PropTypes.func
};

Toggle.defaultProps = {
	size: 'normal',
	checked: false,
	onChange: () => {}
};

export default Toggle;