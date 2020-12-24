import React from "react";
import PropTypes from "prop-types";

// components
import {
	Modal,
	Form,
	Select,
	Input,
	Row,
	Col,
	Button,
	Divider,
	Icon
} from "antd";

//
import { INT, validatorRangeNumer } from "@/utils/regExp";
import { localeMessage } from "@/utils";

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
	labelCol: { span: 10 },
	wrapperCol: { span: 14 }
};

const colStyle = {
	lineHeight: "40px",
	cssFloat: "left"
};

const selectColSpan = 14;

const footerStyle = {
	marginTop: 20,
	paddingTop: 24,
	paddingLeft: 20,
	borderTopWidth: "1px",
	borderTopStyle: "solid",
	borderColor: "#e6e6e6"
};

const IconStyle = {
	fontSize: 24,
	color: "#33a3dc",
	verticalAlign: "middle",
	marginLeft: 5
};

class ProductUnitModal extends React.Component {
	state = {
		value: [],
		opens: [false, false, false],
		name: "",
		isLoading: false
	};

	componentDidMount() {
		const { data, option } = this.props;
		let value;
		if (data.length) {
			value = data.map(obj => ({ ...obj }));
		} else {
			value = option.length
				? [
						{
							packageUnitId: option[0].id,
							packageUnitName: option[0].name,
							default: true
						}
				  ]
				: [{}];
		}
		this.setState({
			value,
			opens: [false, false, false],
			name: ""
		});
	}

	onSubmit = () => {
		const {
			form: { validateFields },
			onOk
		} = this.props;

		const { value } = this.state;

		validateFields((error, values) => {
			if (error) return;

			onOk(value);
		});
	};

	onUnitChange = (index, val) => {
		const { option } = this.props;
		const { value } = this.state;
		const unit = option.find(opt => opt.id === Number(val));
		if (!unit) return;

		const len = value.length;
		const curValue = value.map((obj, i) => {
			return index === i
				? {
						packageUnitId: unit.id,
						packageUnitName: unit.name,
						default: len === 1 ? true : obj.default,
						qty: obj.qty
				  }
				: { ...obj };
		});

		this.setState({
			value: curValue,
			opens: [false, false, false]
		});
	};

	onQtyChange = (index, val) => {
		const { value } = this.state;

		const curValue = value.map((obj, i) => {
			return index === i
				? {
						...obj,
						qty: val
				  }
				: { ...obj };
		});

		this.setState({
			value: curValue
		});
	};

	onChangeDefault = id => {
		const { value } = this.state;
		const curValue = value.map(obj => ({
			...obj,
			default: id === obj.packageUnitId ? true : false
		}));

		this.setState({ value: curValue });
	};

	onAddLevelUnit = () => {
		const {
			form: { validateFields }
		} = this.props;
		const { value } = this.state;

		validateFields((error, values) => {
			if (error) return;

			this.setState({
				value: [...value, {}]
			});
		});
	};

	onRemoveLevelUnit = level => {
		const { value } = this.state;
		const curValue = value.slice(0, level);
		const hasDefailt = curValue.find(obj => obj.default);
		if (!hasDefailt) {
			curValue[0].default = true;
		}
		this.setState({ value: curValue });
	};

	getSelectOption = (unitId1, unitId2) => {
		const { option } = this.props;
		return option
			.filter(opt => opt.id !== unitId1 && opt.id !== unitId2)
			.map(obj => <Option key={obj.id}>{obj.name}</Option>);
	};

	renderDefaultUnitName = unit => {
		return unit.packageUnitName ? (
			<Button
				style={{ marginRight: 12 }}
				type={unit.default ? "primary" : "default"}
				onClick={() => this.onChangeDefault(unit.packageUnitId)}
			>
				{unit.packageUnitName}
			</Button>
		) : null;
	};

	onShowAddItem = index => {
		const { opens } = this.state;
		this.setState({
			name: "",
			opens: opens.map((obj, i) => i === index)
		});
	};

	onHideAddItem = () => {
		this.setState({
			opens: [false, false, false]
		});
	};

	onNameChange = e => {
		const name = e.target.value.trim();
		this.setState({
			name
		});
	};

	onAddUnit = index => {
		const { checkUnitByName, enabledUnit } = this.props;
		const { name } = this.state;
		if (name) {
			this.setState({ isLoading: true });
			checkUnitByName(name, data => {
				if (data) {
					console.log(data);
					if (typeof data === "number") {
						// 创建了产品单位
						this.onUnitChange(index, data);
						this.clearName();
					} else {
						if (data.enabled) {
							console.log(data.enabled);
							this.onUnitChange(index, data.id);
							this.clearName();
						} else {
							Modal.confirm({
								title: localeMessage(
									"modal.productUnit.confirm.title"
								),
								content: localeMessage(
									"modal.productUnit.confirm.tip",
									{ name: data.name }
								),
								onOk: () => {
									enabledUnit(data, () => {
										this.onUnitChange(index, data.id);
										this.clearName();
									});
								},
								onCancel: () => {
									this.clearName();
								},
								zIndex: 9999
							});
						}
					}
				} else {
					// 已存在产品单位
					this.clearName();
				}
			});
		}
	};

	clearName = () => {
		this.setState({
			name: "",
			isLoading: false
		});
	};

	getSelectProps = index => {
		const { opens, name, isLoading } = this.state;
		let props = {
			dropdownStyle: {
				width: 240
			},
			onChange: val => this.onUnitChange(index, val),
			dropdownRender: menu => (
				<div>
					{menu}
					<Divider style={{ margin: "4px 0" }} />
					<div style={{ padding: "8px", cursor: "pointer" }}>
						{opens[index] ? (
							<div style={{ lineHeight: "32px" }}>
								<Input
									onMouseDown={e => {
										e.target.focus();
										e.preventDefault();
									}}
									value={name}
									onChange={e => this.onNameChange(e)}
									maxLength={5}
									style={{
										width: 100
									}}
								/>
								<Icon
									type="close-circle"
									style={IconStyle}
									onClick={() => this.onHideAddItem()}
								/>
								{isLoading ? (
									<Icon type="loading" style={IconStyle} />
								) : (
									<Icon
										type="check-circle"
										theme="filled"
										style={IconStyle}
										onClick={() => this.onAddUnit(index)}
									/>
								)}
							</div>
						) : (
							<a onClick={() => this.onShowAddItem(index)}>
								<Icon type="plus" />{" "}
								{localeMessage("modal.productUnit.createUnit")}
							</a>
						)}
					</div>
				</div>
			)
		};

		if (opens[index]) {
			props.open = true;
		}

		return props;
	};

	render() {
		const { value } = this.state;

		const {
			form: { getFieldDecorator },
			onCancel
		} = this.props;

		const unit1 = value[0] || {};
		const unit2 = value[1] || {};
		const unit3 = value[2] || {};

		const modalProps = {
			title: localeMessage("unit.router.title"),
			visible: true,
			onOk: this.onSubmit,
			onCancel: onCancel,
			width: 600
		};

		const selectProps1 = this.getSelectProps(0);
		const selectProps2 = this.getSelectProps(1);
		const selectProps3 = this.getSelectProps(2);

		return (
			<Modal {...modalProps}>
				<Form>
					<Row gutter={24}>
						<Col span={selectColSpan}>
							<div onMouseDown={e => e.preventDefault()}>
								<FormItem
									label={localeMessage(
										"modal.productUnit.unit1"
									)}
									{...formItemLayout}
								>
									{getFieldDecorator("unitId1", {
										initialValue:
											unit1.packageUnitId &&
											String(unit1.packageUnitId),
										rules: [
											{
												required: true,
												message: localeMessage(
													"modal.productUnit.unit.required"
												)
											}
										]
									})(
										<Select {...selectProps1}>
											{this.getSelectOption(
												unit2.packageUnitId,
												unit3.packageUnitId
											)}
										</Select>
									)}
								</FormItem>
							</div>
						</Col>
						<span style={colStyle}>
							({localeMessage("modal.productUnit.unit.min")})
						</span>
					</Row>

					{value.length > 1 ? (
						<Row gutter={24}>
							<Col span={selectColSpan}>
								<div onMouseDown={e => e.preventDefault()}>
									<FormItem
										label={localeMessage(
											"modal.productUnit.unit2"
										)}
										{...formItemLayout}
									>
										{getFieldDecorator("unitId2", {
											initialValue:
												unit2.packageUnitId &&
												String(unit2.packageUnitId),
											rules: [
												{
													required: true,
													message: localeMessage(
														"modal.productUnit.unit.required"
													)
												}
											]
										})(
											<Select {...selectProps2}>
												{this.getSelectOption(
													unit1.packageUnitId,
													unit3.packageUnitId
												)}
											</Select>
										)}
									</FormItem>
								</div>
							</Col>
							<span style={colStyle}>=</span>
							<Col span={6}>
								<FormItem>
									{getFieldDecorator("count2", {
										initialValue: unit2.qty,
										validateFirst: true,
										rules: [
											{
												required: true,
												message: localeMessage(
													"modal.productUnit.count.required"
												)
											},
											{
												validator: (
													rules,
													value,
													callback
												) =>
													validatorRangeNumer({
														value,
														callback,
														max: 100,
														min: 2,
														message: localeMessage(
															"modal.productUnit.count.validator"
														)
													})
											},
											{
												pattern: INT,
												message: localeMessage(
													"common.test.int"
												)
											}
										]
									})(
										<Input
											onChange={e =>
												this.onQtyChange(
													1,
													e.target.value
												)
											}
										/>
									)}
								</FormItem>
							</Col>
							<span style={colStyle}>
								{unit1 && unit1.packageUnitName}
							</span>
							{value.length === 2 ? (
								<Col style={colStyle}>
									<Button
										icon="delete"
										onClick={() =>
											this.onRemoveLevelUnit(1)
										}
									/>
								</Col>
							) : null}
						</Row>
					) : null}
					{value.length > 2 ? (
						<Row gutter={24}>
							<Col span={selectColSpan}>
								<div onMouseDown={e => e.preventDefault()}>
									<FormItem
										label={localeMessage(
											"modal.productUnit.unit3"
										)}
										{...formItemLayout}
									>
										{getFieldDecorator("unitId3", {
											initialValue:
												unit3.packageUnitId &&
												String(unit3.packageUnitId),
											rules: [
												{
													required: true,
													message: localeMessage(
														"modal.productUnit.unit.required"
													)
												}
											]
										})(
											<Select {...selectProps3}>
												{this.getSelectOption(
													unit1.packageUnitId,
													unit2.packageUnitId
												)}
											</Select>
										)}
									</FormItem>
								</div>
							</Col>
							<span style={colStyle}>=</span>
							<Col span={6}>
								<FormItem>
									{getFieldDecorator("count3", {
										initialValue: unit3.qty,
										validateFirst: true,
										rules: [
											{
												required: true,
												message: localeMessage(
													"modal.productUnit.count.required"
												)
											},
											{
												validator: (
													rules,
													value,
													callback
												) =>
													validatorRangeNumer({
														value,
														callback,
														max: 100,
														min: 2,
														message: localeMessage(
															"modal.productUnit.count.validator"
														)
													})
											},
											{
												pattern: INT,
												message: localeMessage(
													"common.test.int"
												)
											}
										]
									})(
										<Input
											onChange={e =>
												this.onQtyChange(
													2,
													e.target.value
												)
											}
										/>
									)}
								</FormItem>
							</Col>
							<span style={colStyle}>
								{unit2 && unit2.packageUnitName}
							</span>
							{value.length > 2 ? (
								<Col style={colStyle}>
									<Button
										icon="delete"
										onClick={() =>
											this.onRemoveLevelUnit(2)
										}
									/>
								</Col>
							) : null}
						</Row>
					) : null}
					{value.length < 3 ? (
						<div style={{ textAlign: "center" }}>
							<Button
								type="primary"
								onClick={() => this.onAddLevelUnit()}
							>
								{localeMessage("modal.productUnit.unit.create")}
							</Button>
						</div>
					) : null}
				</Form>

				<div style={footerStyle}>
					<Row gutter={24}>
						<Col
							span={6}
							style={{ lineHeight: "32px", paddingLeft: 38 }}
						>
							{localeMessage("modal.productUnit.unit.default")}：
						</Col>
						<Col span={16}>
							{this.renderDefaultUnitName(unit1)}
							{this.renderDefaultUnitName(unit2)}
							{this.renderDefaultUnitName(unit3)}
						</Col>
					</Row>
				</div>
			</Modal>
		);
	}
}

ProductUnitModal.defaultProps = {};

ProductUnitModal.propTypes = {
	onOk: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	checkUnitByName: PropTypes.func.isRequired,
	enabledUnit: PropTypes.func.isRequired
};

export default Form.create()(ProductUnitModal);
