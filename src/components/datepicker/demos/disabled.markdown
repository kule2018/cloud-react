---
order: 5
title: 禁用
desc: 选择框的不可用状态。
---

```javascript
import React from 'react';
import { Datepicker } from 'cloud-react';

export default class DatePickerDemo extends React.Component {
	render() {
		return (
			<div>
				<Datepicker.YearPicker disabled value="" placeholder="年" />
				<br />
				<br />
				<Datepicker.YearMonthPicker disabled value="" placeholder="年月" />
				<br />
				<br />
				<Datepicker.MonthDayPicker disabled value="" placeholder="月日" />
				<br />
				<br />
				<Datepicker.TimePicker disabled value="" />
				<br />
				<br />
				<Datepicker disabled placeholder="年月日" />
				<br />
				<br />
				<Datepicker disabled showTimePicker={true} placeholder="年月日 时分秒" />
				<br />
				<br />
			</div>
		);
	}
}
```
