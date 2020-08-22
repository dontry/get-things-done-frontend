import React, { FormEvent, useState } from "react";
import { FormComponentProps } from "antd/lib/form/Form";
import { Form, Icon, Input, Button, Select, InputNumber } from "antd";
import { formItemLayout, footerFormItemLayout } from "../constants/layout";
const { Option } = Select;

interface IFormProps {
  onSubmit(user: any): Promise<void>;
}

// https://ant.design/components/form/?locale=en-US#components-form-demo-register
const RawRegisterForm: React.FC<IFormProps & FormComponentProps> = props => {
  const { getFieldDecorator } = props.form;
  const [confirmDirty, setConfirmDirty] = useState(false);

  const _handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    props.form.validateFields((err: Error, values: []) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
      props.onSubmit(values);
    });
  };

  const _handleConfirmBlur = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setConfirmDirty(confirmDirty || !!value);
  };

  const _compareToFirstPassword = (rule: any, value: string, callback: (s?: string) => void) => {
    if (value && value !== props.form.getFieldValue("password")) {
      callback("The password you entered is not the same.");
    } else {
      callback();
    }
  };

  const _validateAge = (rule: any, value: number, callback: (s?: string) => void) => {
    if (value < 18) {
      callback("Your age should not be under 18.");
    } else {
      callback();
    }
  };

  const _validateToNextPassword = (rule: any, value: string, callback: (s?: string) => void) => {
    if (value && confirmDirty) {
      props.form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  return (
    <Form onSubmit={_handleSubmit} className="login-form">
      <Form.Item {...formItemLayout} label="Username">
        {getFieldDecorator("username", {
          rules: [{ required: true, message: "Please input your username!" }]
        })(
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Username"
          />
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="E-mail">
        {getFieldDecorator("email", {
          rules: [
            {
              type: "email",
              message: "The input is not a valid E-mail."
            },
            {
              required: true,
              message: "Please input your E-mail."
            }
          ]
        })(<Input placeholder="john.doe@xmail.com" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Password">
        {getFieldDecorator("password", {
          rules: [
            { required: true, message: "Please input your Password!" },
            { validator: _validateToNextPassword }
          ]
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            onBlur={_handleConfirmBlur}
          />
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Confirm Password">
        {getFieldDecorator("confirm", {
          rules: [
            { required: true, message: "Please confirm your Password!" },
            {
              validator: _compareToFirstPassword
            }
          ]
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
          />
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Age">
        {getFieldDecorator("age", {
          rules: [
            { required: true, message: "Input your age." },
            {
              validator: _validateAge
            }
          ]
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Sex">
        {getFieldDecorator("sex", {
          initialValue: ""
        })(
          <Select>
            <Option value="" />
            <Option value="MALE">Male</Option>
            <Option value="FEMALE">Female</Option>
            <Option value="OTHER">Other</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item {...footerFormItemLayout}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

const RegisterForm = Form.create()(RawRegisterForm);

export default RegisterForm;
