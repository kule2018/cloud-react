import Store from '../store';

describe('Tree store', () => {
	describe('initData', () => {
		let store;
		let treeData;
		let maxLevel;
		let selectedValue;
		let isUnfold;
		beforeEach(() => {
			store = new Store();
		});
		afterEach(() => {
			store = null;
			treeData = null;
			maxLevel = null;
			selectedValue = null;
			isUnfold = null;
		});
		it('数据不存在或无数据时', () => {
			expect(store.initData(treeData)).toEqual([]);
			treeData = [];
			expect(store.initData(treeData)).toEqual([]);
		});

		it('仅有一条数据时', () => {
			treeData = [
				{
					id: 1,
					name: '所有',
					pId: null,
					checked: true,
					children: [],
					indeterminate: true,
					level: 1,
					disableRemove: true,
					disableRename: true
				}
			];
			expect(store.initData(treeData)).toEqual(treeData);
		});

		it('存在回显数据,且层级限制', () => {
			treeData = [
				{
					id: 1,
					name: '所有',
					pId: null,
					checked: true,
					children: [
						{
							id: 2,
							name: '第一个节点',
							pId: 1
						},
						{
							id: 2,
							name: '第二个节点',
							pId: 1
						}
					]
				}
			];
			selectedValue = [
				{
					id: 2,
					name: '第一个节点'
				}
			];
			maxLevel = 2;
			expect(store.initData(treeData, maxLevel, selectedValue, isUnfold)).toEqual([
				{
					id: 1,
					name: '所有',
					pId: null,
					indeterminate: true,
					isUnfold: true,
					checked: true,
					level: 1,
					children: [
						{
							id: 2,
							name: '第一个节点',
							pId: 1,
							isActive: true,
							checked: true,
							disableAdd: true,
							indeterminate: true,
							children: [],
							isUnfold: null,
							level: 2
						},
						{
							id: 2,
							name: '第二个节点',
							pId: 1,
							checked: true,
							indeterminate: true,
							children: [],
							disableAdd: true,
							isUnfold: null,
							level: 2
						}
					]
				}
			]);
		});

		it('向下递归查找 ', () => {
			treeData = [
				{
					id: 1,
					name: '所有',
					pId: null,
					checked: true,
					children: [
						{
							id: 2,
							name: '第一个节点',
							pId: 1
						},
						{
							id: 2,
							name: '第二个节点',
							pId: 1
						}
					]
				}
			];
			expect(store.initData(treeData, maxLevel, selectedValue, isUnfold)).toEqual([
				{
					id: 1,
					name: '所有',
					pId: null,
					indeterminate: true,
					isUnfold: true,
					checked: true,
					level: 1,
					children: [
						{
							id: 2,
							name: '第一个节点',
							pId: 1,
							checked: true,
							indeterminate: true,
							children: [],
							isUnfold: null,
							level: 2
						},
						{
							id: 2,
							name: '第二个节点',
							pId: 1,
							checked: true,
							indeterminate: true,
							children: [],
							isUnfold: null,
							level: 2
						}
					]
				}
			]);
		});
	});

	describe('onResetData', () => {
		let store;
		let treeData;
		beforeEach(() => {
			store = new Store();
		});
		afterEach(() => {
			store = null;
			treeData = null;
		});
		it('传入空数组', () => {
			treeData = [];
			expect(store.onResetData(treeData)).toEqual([]);
		});

		it('传入不包含children的数组', () => {
			treeData = [
				{
					id: 1,
					name: '所有',
					pId: null,
					disableRemove: true,
					disableRename: true
				}
			];
			expect(store.onResetData(treeData)).toEqual([
				{
					id: 1,
					name: '所有',
					pId: null,
					disableRemove: true,
					disableRename: true,
					indeterminate: false,
					checked: false
				}
			]);
		});

		it('传入包含children的数组', () => {
			treeData = [
				{
					id: 1,
					name: '所有',
					pId: null,
					disableRemove: true,
					disableRename: true,
					children: [
						{
							id: 11,
							name: '所有',
							pId: null,
							disableRemove: true,
							disableRename: true
						}
					]
				}
			];
			expect(store.onResetData(treeData)).toEqual([
				{
					id: 1,
					name: '所有',
					pId: null,
					disableRemove: true,
					disableRename: true,
					indeterminate: false,
					checked: false,
					children: [
						{
							id: 11,
							name: '所有',
							pId: null,
							disableRemove: true,
							disableRename: true,
							indeterminate: false,
							checked: false
						}
					]
				}
			]);
		});
	});

	describe('selectedForRadio', () => {
		let store;
		let treeData;
		let node;
		beforeEach(() => {
			store = new Store();
		});
		afterEach(() => {
			store = null;
			treeData = null;
			node = null;
		});
		it('无已选中数据', () => {
			treeData = [
				{
					id: 1,
					name: 'cloud'
				},
				{
					id: 2,
					name: 'react'
				}
			];
			node = {
				id: 3,
				name: 'angular'
			};
			expect(store.selectedForRadio(treeData, node)).toEqual([]);
		});
		it('数据不包含children字段', () => {
			treeData = [
				{
					id: 1,
					name: 'cloud'
				},
				{
					id: 2,
					name: 'react'
				}
			];
			node = {
				id: 2,
				name: 'react'
			};
			expect(store.selectedForRadio(treeData, node)).toEqual([
				{
					id: 2,
					name: 'react'
				}
			]);
		});

		it('数据包含children字段', () => {
			treeData = [
				{
					id: 1,
					name: 'cloud',
					children: [
						{
							id: 11,
							name: 'cloud-react'
						},
						{
							id: 12,
							name: 'cloud-vue'
						}
					]
				},
				{
					id: 2,
					name: 'react'
				}
			];
			node = {
				id: 1,
				name: 'cloud'
			};
			expect(store.selectedForRadio(treeData, node)).toEqual([
				{
					id: 1,
					name: 'cloud',
					children: [
						{
							id: 11,
							name: 'cloud-react'
						},
						{
							id: 12,
							name: 'cloud-vue'
						}
					]
				}
			]);

			node = {
				id: 2,
				name: 'react'
			};
			expect(store.selectedForRadio(treeData, node)).toEqual([
				{
					id: 2,
					name: 'react'
				}
			]);

			node = {
				id: 12,
				name: 'cloud-vue'
			};
			expect(store.selectedForRadio(treeData, node)).toEqual([
				{
					id: 12,
					name: 'cloud-vue'
				}
			]);
		});
	});

	describe('selectedForCheckbox', () => {
		let store;
		let treeData;
		let node;
		beforeEach(() => {
			store = new Store();
		});
		afterEach(() => {
			store = null;
			treeData = null;
			node = null;
		});
		it('无已选中数据', () => {
			treeData = [
				{
					id: 1,
					name: 'cloud'
				},
				{
					id: 2,
					name: 'react'
				}
			];
			node = {
				id: 3,
				name: 'angular'
			};
			expect(store.selectedForCheckbox(treeData, node)).toEqual([
				{
					id: 1,
					name: 'cloud'
				},
				{
					id: 2,
					name: 'react'
				}
			]);
		});

		it('子项中存在部分数据被选中', () => {
			treeData = [
				{
					id: 1,
					name: 'cloud',
					pId: null
				},
				{
					id: 2,
					name: 'react',
					pId: null,
					children: [
						{
							id: 21,
							name: 'mobx',
							pId: 2,
							children: [
								{
									id: 211,
									name: 'cloud-react',
									pId: 21,
									children: [
										{
											id: 2111,
											name: 'cloud-react-tree',
											pId: 211,
											checked: true
										},
										{
											id: 2112,
											name: 'cloud-react-modal',
											pId: 211
										}
									]
								},
								{
									id: 212,
									name: 'cloud-business',
									pId: 21,
									checked: true,
									children: [
										{
											id: 2121,
											name: 'cloud-business-good',
											pId: 212,
											checked: true
										},
										{
											id: 2122,
											name: 'cloud-business-shop',
											pId: 212
										}
									]
								},
								{
									id: 213,
									name: 'react-hook',
									pId: 21
								}
							]
						},
						{
							id: 22,
							name: 'ant',
							pId: 2
						}
					]
				}
			];
			node = {
				id: 211,
				name: 'mobx',
				checked: false,
				pId: 21,
				indeterminate: true,
				children: [
					{
						id: 211,
						name: 'cloud-react',
						checked: false,
						pId: 21,
						children: [
							{
								id: 2111,
								name: 'cloud-react-tree',
								pId: 211
							},
							{
								id: 2112,
								name: 'cloud-react-modal',
								pId: 211
							}
						]
					},
					{
						id: 212,
						name: 'cloud-business',
						checked: false,
						pId: 21
					},
					{
						id: 213,
						name: 'react-hook',
						pId: 21
					}
				]
			};

			expect(store.selectedForCheckbox(treeData, node)).toEqual([
				{
					id: 1,
					name: 'cloud',
					pId: null
				},
				{
					id: 2,
					name: 'react',
					checked: false,
					pId: null,
					indeterminate: true,
					children: [
						{
							id: 21,
							name: 'mobx',
							checked: false,
							indeterminate: true,
							pId: 2,
							children: [
								{
									id: 211,
									name: 'cloud-react',
									pId: 21,
									children: [
										{
											id: 2111,
											name: 'cloud-react-tree',
											pId: 211,
											checked: true
										},
										{
											id: 2112,
											name: 'cloud-react-modal',
											pId: 211
										}
									]
								},
								{
									id: 212,
									name: 'cloud-business',
									pId: 21,
									checked: true,
									children: [
										{
											id: 2121,
											name: 'cloud-business-good',
											pId: 212,
											checked: true
										},
										{
											id: 2122,
											name: 'cloud-business-shop',
											pId: 212
										}
									]
								},
								{
									id: 213,
									name: 'react-hook',
									pId: 21
								}
							]
						},
						{
							id: 22,
							name: 'ant',
							pId: 2
						}
					]
				}
			]);
		});

		it('子项中无数据被选中', () => {
			treeData = [
				{
					id: 1,
					name: 'cloud',
					pId: null
				},
				{
					id: 2,
					name: 'react',
					pId: null,
					children: [
						{
							id: 21,
							name: 'mobx',
							pId: 2,
							children: [
								{
									id: 211,
									name: 'cloud-react',
									pId: 21,
									children: [
										{
											id: 2111,
											name: 'cloud-react-tree',
											pId: 211
										},
										{
											id: 2112,
											name: 'cloud-react-modal',
											pId: 211
										}
									]
								},
								{
									id: 212,
									name: 'cloud-business',
									pId: 21,
									children: [
										{
											id: 2121,
											name: 'cloud-business-good',
											pId: 212
										},
										{
											id: 2122,
											name: 'cloud-business-shop',
											pId: 212
										}
									]
								},
								{
									id: 213,
									name: 'react-hook',
									pId: 21
								}
							]
						},
						{
							id: 22,
							name: 'ant',
							pId: 2
						}
					]
				}
			];
			node = {
				id: 211,
				name: 'cloud-react',
				pId: 21,
				children: [
					{
						id: 2111,
						name: 'cloud-react-tree',
						pId: 211
					},
					{
						id: 2112,
						name: 'cloud-react-modal',
						pId: 211
					}
				]
			};

			expect(store.selectedForCheckbox(treeData, node)).toEqual([
				{
					id: 1,
					name: 'cloud',
					pId: null
				},
				{
					id: 2,
					name: 'react',
					pId: null,
					indeterminate: false,
					checked: false,
					children: [
						{
							id: 21,
							name: 'mobx',
							checked: false,
							indeterminate: false,
							pId: 2,
							children: [
								{
									id: 211,
									name: 'cloud-react',
									pId: 21,
									children: [
										{
											id: 2111,
											name: 'cloud-react-tree',
											pId: 211
										},
										{
											id: 2112,
											name: 'cloud-react-modal',
											pId: 211
										}
									]
								},
								{
									id: 212,
									name: 'cloud-business',
									pId: 21,
									children: [
										{
											id: 2121,
											name: 'cloud-business-good',
											pId: 212
										},
										{
											id: 2122,
											name: 'cloud-business-shop',
											pId: 212
										}
									]
								},
								{
									id: 213,
									name: 'react-hook',
									pId: 21
								}
							]
						},
						{
							id: 22,
							name: 'ant',
							pId: 2
						}
					]
				}
			]);
		});

		it('子项全部数据被选中', () => {
			treeData = [
				{
					id: 2,
					name: 'react',
					pId: null,
					children: [
						{
							id: 21,
							name: 'mobx',
							pId: 2,
							children: [
								{
									id: 211,
									name: 'cloud-react',
									pId: 21,
									children: [
										{
											id: 2111,
											name: 'cloud-react-tree',
											pId: 211,
											checked: true
										}
									]
								},
								{
									id: 212,
									name: 'cloud-business',
									pId: 21,
									children: [
										{
											id: 2121,
											name: 'cloud-business-good',
											pId: 212
										},
										{
											id: 2122,
											name: 'cloud-business-shop',
											pId: 212
										}
									]
								},
								{
									id: 213,
									name: 'react-hook',
									pId: 21
								}
							]
						},
						{
							id: 22,
							name: 'ant',
							pId: 2
						}
					]
				}
			];
			node = {
				id: 2111,
				name: 'cloud-react-tree',
				pId: 211
			};

			expect(store.selectedForCheckbox(treeData, node)).toEqual([
				{
					id: 2,
					name: 'react',
					pId: null,
					checked: false,
					indeterminate: true,
					children: [
						{
							id: 21,
							name: 'mobx',
							checked: false,
							indeterminate: true,
							pId: 2,
							children: [
								{
									id: 211,
									name: 'cloud-react',
									pId: 21,
									checked: true,
									indeterminate: false,
									children: [
										{
											id: 2111,
											name: 'cloud-react-tree',
											pId: 211,
											checked: true
										}
									]
								},
								{
									id: 212,
									name: 'cloud-business',
									pId: 21,
									children: [
										{
											id: 2121,
											name: 'cloud-business-good',
											pId: 212
										},
										{
											id: 2122,
											name: 'cloud-business-shop',
											pId: 212
										}
									]
								},
								{
									id: 213,
									name: 'react-hook',
									pId: 21
								}
							]
						},
						{
							id: 22,
							name: 'ant',
							pId: 2
						}
					]
				}
			]);
		});
	});

	describe('findNodeByParam', () => {
		let store;
		let treeData;
		beforeEach(() => {
			store = new Store();
		});
		afterEach(() => {
			store = null;
			treeData = null;
		});
		it('数组为空', () => {
			treeData = [];
			expect(store.findNodeByParam(treeData, 'id', 1)).toBe(null);
		});
		it('无匹配项', () => {
			treeData = [
				{
					key: 1,
					name: 'cloud-vue'
				},
				{
					key: 2,
					name: 'cloud-react'
				}
			];
			expect(store.findNodeByParam(treeData, 'key', 3)).toBe(null);
		});
		it('匹配成功', () => {
			treeData = [
				{
					key: 1,
					name: 'cloud-vue'
				},
				{
					key: 2,
					name: 'cloud-react'
				}
			];
			expect(store.findNodeByParam(treeData, 'key', 2)).toEqual({
				key: 2,
				name: 'cloud-react'
			});
		});
		it('存在children', () => {
			treeData = [
				{
					key: 1,
					name: 'cloud-vue'
				},
				{
					key: 2,
					name: 'cloud-react',
					children: [
						{
							key: 21,
							name: 'tree'
						},
						{
							key: 22,
							name: 'table'
						}
					]
				}
			];
			expect(store.findNodeByParam(treeData, 'name', 'table')).toEqual({
				key: 22,
				name: 'table'
			});
		});
	});

	describe('findNodeById', () => {
		let store;
		let treeData;
		beforeEach(() => {
			store = new Store();
		});
		afterEach(() => {
			store = null;
			treeData = null;
		});
		it('数组为空', () => {
			treeData = [];
			expect(store.findNodeById(treeData, 1)).toBe(null);
		});
		it('无匹配项', () => {
			treeData = [
				{
					id: 1,
					name: 'cloud-vue'
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			];
			expect(store.findNodeById(treeData, 3)).toBe(null);
		});
		it('匹配成功', () => {
			treeData = [
				{
					id: 1,
					name: 'cloud-vue'
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			];
			expect(store.findNodeById(treeData, 2)).toEqual({
				id: 2,
				name: 'cloud-react'
			});
		});
	});

	describe('updateNodeById', () => {
		let store;
		let treeData;
		beforeEach(() => {
			store = new Store();
		});
		afterEach(() => {
			store = null;
			treeData = null;
		});
		it('无匹配项', () => {
			treeData = [
				{
					id: 1,
					name: 'cloud-vue'
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			];
			expect(store.updateNodeById(treeData, 3, { name: 'cloud-angular' })).toBe(null);
		});

		it('更新成功', () => {
			treeData = [
				{
					id: 1,
					name: 'cloud-vue'
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			];
			expect(store.updateNodeById(treeData, 2, { name: 'cloud-angular' })).toEqual({
				id: 2,
				name: 'cloud-angular'
			});
		});
	});

	describe('onFoldNode', () => {
		let store;
		let treeData;
		beforeEach(() => {
			store = new Store();
			treeData = [
				{
					id: 1,
					name: 'cloud-vue'
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			];
		});
		afterEach(() => {
			store = null;
			treeData = null;
		});
		it('不存在isUnfold时执行', () => {
			expect(store.onFoldNode(treeData, { id: 2 })).toEqual([
				{
					id: 1,
					name: 'cloud-vue'
				},
				{
					id: 2,
					name: 'cloud-react',
					isUnfold: true
				}
			]);
		});
		it('存在isUnfold时执行', () => {
			expect(store.onFoldNode(treeData, { id: 2, isUnfold: true })).toEqual([
				{
					id: 1,
					name: 'cloud-vue'
				},
				{
					id: 2,
					name: 'cloud-react',
					isUnfold: false
				}
			]);
		});
	});

	describe('addChildNode', () => {
		let store;
		let treeData;
		beforeEach(() => {
			store = new Store();
			treeData = [
				{
					id: 1,
					name: 'cloud-vue'
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			];
		});
		afterEach(() => {
			store = null;
			treeData = null;
		});
		it('当前不存在children', () => {
			expect(store.addChildNode(treeData, 1, { id: 11, name: 'tree' })).toEqual([
				{
					id: 1,
					name: 'cloud-vue',
					children: [
						{
							id: 11,
							name: 'tree'
						}
					]
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			]);
		});
		it('存在children', () => {
			treeData[0].children = [
				{
					id: 11,
					name: 'tree'
				}
			];
			expect(store.addChildNode(treeData, 1, { id: 12, name: 'table' })).toEqual([
				{
					id: 1,
					name: 'cloud-vue',
					children: [
						{
							id: 11,
							name: 'tree'
						},
						{
							id: 12,
							name: 'table'
						}
					]
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			]);
		});
		it('添加至最前方', () => {
			treeData[0].children = [
				{
					id: 11,
					name: 'tree'
				}
			];
			expect(store.addChildNode(treeData, 1, { id: 12, name: 'table' }, true)).toEqual([
				{
					id: 1,
					name: 'cloud-vue',
					children: [
						{
							id: 12,
							name: 'table'
						},
						{
							id: 11,
							name: 'tree'
						}
					]
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			]);
		});
	});

	describe('checkRepeatName', () => {
		let store;
		let treeData;
		let node;
		beforeEach(() => {
			store = new Store();
			treeData = [
				{
					id: 1,
					name: 'cloud-vue'
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			];
		});
		afterEach(() => {
			store = null;
			treeData = null;
			node = null;
		});
		it('名称不重复', () => {
			node = { id: 1, name: 'cloud-vue' };
			expect(store.checkRepeatName(treeData, node, 'tree')).toBe(false);
		});
		it('新增时名称重复', () => {
			node = { id: 1, name: 'cloud-vue', isAdd: true };
			expect(store.checkRepeatName(treeData, node, 'cloud-vue')).toBe(true);
		});
		it('编辑时名称重复', () => {
			node = { id: 1, name: 'cloud-vue', isAdd: false };
			expect(store.checkRepeatName(treeData, node, 'cloud-react')).toBe(true);
		});
		it('编辑时名称未做修改', () => {
			node = { id: 1, name: 'cloud-vue', isAdd: false };
			expect(store.checkRepeatName(treeData, node, 'cloud-vue')).toBe(false);
		});
	});

	describe('removeChildNode', () => {
		let store;
		let treeData;
		let node;
		beforeEach(() => {
			store = new Store();
			treeData = [
				{
					id: 1,
					name: 'cloud-vue',
					children: [
						{
							id: 11,
							name: 'tree',
							pId: 1
						},
						{
							id: 12,
							name: 'tree',
							children: [
								{
									id: 121,
									name: 'tree'
								}
							],
							pId: 1
						}
					]
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			];
		});
		afterEach(() => {
			store = null;
			treeData = null;
			node = null;
		});
		it('删除成功: 当前为顶层', () => {
			expect(store.removeChildNode(treeData, treeData[0])).toBe(false);
		});
		it('删除成功: 存在子节点', () => {
			expect(store.removeChildNode(treeData, treeData[0].children[1])).toBe(false);
		});
		it('删除成功: 不存在该节点', () => {
			node = { id: 3, name: 'cloud-angular', pId: 1 };
			expect(store.removeChildNode(treeData, node)).toBe(false);
		});
		it('删除成功', () => {
			expect(store.removeChildNode(treeData, treeData[0].children[0])).toBe(true);
		});
	});

	describe('renameChildNode', () => {
		let store;
		let treeData;
		beforeEach(() => {
			store = new Store();
			treeData = [
				{
					id: 1,
					name: 'cloud-vue',
					children: [
						{
							id: 11,
							name: 'tree',
							pId: 1
						},
						{
							id: 12,
							name: 'tree',
							children: [
								{
									id: 121,
									name: 'tree'
								}
							],
							pId: 1
						}
					]
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			];
		});
		afterEach(() => {
			store = null;
			treeData = null;
		});
		it('执行验证', () => {
			expect(store.renameChildNode(treeData, 11, 'newName')[0].children[0].name).toBe('newName');
		});
	});

	describe('searchNode', () => {
		let store;
		let treeData;
		beforeEach(() => {
			store = new Store();
			treeData = [
				{
					id: 1,
					name: 'cloud-vue',
					children: [
						{
							id: 11,
							name: 'cloud-tree',
							pId: 1
						},
						{
							id: 12,
							name: 'cloud-table',
							children: [
								{
									id: 121,
									name: 'table'
								}
							],
							pId: 1
						}
					]
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			];
		});
		afterEach(() => {
			store = null;
			treeData = null;
		});
		it('搜索文本为空', () => {
			expect(store.searchNode(treeData)).toEqual(treeData);
		});
		it('搜索文本不存在', () => {
			expect(store.searchNode(treeData, 'baukh')).toEqual([]);
		});
		it('搜索文本存在且该项无子项', () => {
			expect(store.searchNode(treeData, 'cloud-react')).toEqual([
				{
					id: 2,
					name: 'cloud-react'
				}
			]);
		});
		it('搜索文本存在且子项也存在', () => {
			expect(store.searchNode(treeData, 'cloud')).toEqual([
				{
					id: 1,
					name: 'cloud-vue',
					isUnfold: true,
					children: [
						{
							id: 11,
							name: 'cloud-tree',
							pId: 1
						},
						{
							id: 12,
							name: 'cloud-table',
							isUnfold: false,
							children: [
								{
									id: 121,
									name: 'table'
								}
							],
							pId: 1
						}
					]
				},
				{
					id: 2,
					name: 'cloud-react'
				}
			]);
		});
	});
});
