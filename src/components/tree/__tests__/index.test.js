import React, { Component } from 'react';
import mountTest from '@tests/shared/mountTest';
import { mount, render } from 'enzyme';
import renderer from 'react-test-renderer';
import { prefixCls } from '@utils';

import Tree from '../index';

const classSelector = `${prefixCls}-tree`;

const treeData = [
	{
		id: 1,
		name: '所有',
		pId: null,
		disableRemove: true,
		disableRename: true,
		children: [
			{
				id: 11,
				name: '禁止删除节点',
				pId: 1,
				disableRemove: true,
				children: [
					{
						id: 111,
						name: '删除一个',
						pId: 11,
						children: []
					},
					{
						id: 112,
						name: '删除两个',
						pId: 11,
						children: []
					},
					{
						id: 113,
						name: '删除三个',
						pId: 11,
						children: [
							{
								id: 1131,
								name: '禁止删除节点31',
								pId: 113,
								children: []
							},
							{
								id: 1132,
								name: '禁止删除节点32',
								pId: 113,
								children: [
									{
										id: 11321,
										name: '禁止删除节点321',
										pId: 1132,
										children: []
									}
								]
							}
						]
					},
					{
						id: 114,
						name: '禁止删除节点4',
						pId: 11,
						children: []
					}
				]
			},
			{
				id: 12,
				name: '禁止新增节点',
				pId: 1,
				disableAdd: true,
				children: [
					{
						id: 121,
						name: '禁止新增节点1',
						pId: 12,
						children: [
							{
								id: 1211,
								name: '禁止新增节点11',
								pId: 121,
								children: []
							},
							{
								id: 1212,
								name: '禁止新增节点12',
								pId: 121,
								children: []
							},
							{
								id: 1213,
								name: '禁止新增节点13',
								pId: 121,
								children: []
							}
						]
					},
					{
						id: 122,
						name: '禁止新增节点2',
						pId: 12,
						children: [
							{
								id: 1221,
								name: '禁止新增节点21',
								pId: 122,
								children: []
							},
							{
								id: 1222,
								name: '禁止新增节点22',
								pId: 122,
								children: []
							}
						]
					}
				]
			},
			{
				id: 13,
				name: '禁止重命名节点',
				pId: 1,
				disableRename: true,
				children: [
					{
						id: 131,
						name: '禁止重命名节点1',
						pId: 13,
						children: [
							{
								id: 1311,
								name: '禁止重命名节点11',
								pId: 131,
								children: []
							},
							{
								id: 1312,
								name: '禁止重命名节点12',
								pId: 131,
								children: []
							},
							{
								id: 1313,
								name: '禁止重命名节点13',
								pId: 131,
								children: []
							}
						]
					},
					{
						id: 132,
						name: '禁止重命名节点2',
						pId: 13,
						children: [
							{
								id: 1321,
								name: '禁止重命名节点21',
								pId: 132,
								children: []
							}
						]
					}
				]
			},
			{
				id: 14,
				name: '未分类',
				pId: 1,
				disableRemove: true,
				disableAdd: true,
				disableRename: true,
				children: []
			}
		]
	}
];

class TreeTest extends Component {
	render() {
		return <Tree treeData={treeData} {...this.props}></Tree>;
	}
}

describe('Tree', () => {
	mountTest(TreeTest);

	// 正常挂载
	it('renders correctly', () => {
		const wrapper = render(<TreeTest treeData={treeData} />);
		expect(wrapper).toMatchSnapshot();
	});

	// 正常卸载
	it('mount correctly', () => {
		expect(() => renderer.create(<TreeTest treeData={treeData} />)).not.toThrow();
	});

	// 自定义类名
	it('className work correctly', () => {
		const wrapper = mount(<TreeTest className="tree-test" />);
		expect(
			wrapper
				.find(`.${classSelector}`)
				.at(0)
				.hasClass('tree-test')
		).toBeTruthy();
	});

	//

	// 搜索相关
	it('search tree work correctly ', () => {
		const onSearch = jest.fn();
		const wrapper = mount(
			<TreeTest treeData={treeData} supportImmediatelySearch supportSearch searchPlaceholder="搜索节点" searchMaxLength={20} onSearchResult={onSearch} />
		);
		wrapper
			.find(`.${classSelector}`)
			.at(0)
			.simulate('click');

		expect(wrapper.find(`.${classSelector}-search`)).toHaveLength(1);

		const searchInput = wrapper.find('.cloud-tree-search-input').at(0);
		expect(searchInput.props().placeholder).toEqual('搜索节点');
		expect(searchInput.props().maxLength).toEqual(20);

		wrapper
			.find('.cloud-tree-search-input')
			.at(0)
			.simulate('change', { target: { value: 'multi' } });

		expect(searchInput.props().onSearchResult).toHaveBeenCalledWith();
	});
});
