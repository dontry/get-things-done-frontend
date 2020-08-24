import React from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Link } from 'react-router-dom';

import { Form, Icon, Input, Button, Checkbox, message } from 'antd';

const footerFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    }
  }
};

export interface ILoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

interface IFormProps {
  onSubmit(credential: ILoginFormValues): Promise<void>;
}

class RawLoginForm extends React.Component<IFormProps & FormComponentProps> {
  public render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this._handleSubmit} className='login-form'>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Username'
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='Password'
            />
          )}
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <a className='login-form-forgot' href=''>
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' className='login-form-button'>
            Log in
          </Button>
          <span style={{ marginLeft: 15 }}>Or</span> <Link to='/register'>Register now!</Link>
        </Form.Item>
      </Form>
    );
  }
  public _handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err: Error, values: any) => {
      if (!err) {
        const { username, password, remember } = values;
        this.props.onSubmit({ username, password, remember });
      }
    });
  };
}

const LoginForm = Form.create()(RawLoginForm);

export default LoginForm;
