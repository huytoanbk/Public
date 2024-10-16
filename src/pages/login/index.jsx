import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Divider, notification } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  const handleLogin = async (data) => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', data);
      if (response.status === 201) {
        localStorage.setItem('token', 'fake-jwt-token');
        notification.success({
          message: 'Login successful',
        });
        navigate('/admin');
      }
    } catch (error) {
      setError('username', { message: 'Invalid username or password' });
      notification.error({
        message: 'Login failed',
      });
    }
  };

  const handleRegister = async (data) => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', data);
      if (response.status === 201) {
        notification.success({
          message: 'Registration successful',
        });
        reset();
        setIsRegister(false);
      }
    } catch (error) {
      notification.error({
        message: 'Registration failed',
      });
    }
  };

  const onSubmit = (data) => {
    if (isRegister) {
      handleRegister(data);
    } else {
      handleLogin(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-4">
          <Form.Item
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  className="py-2 px-3"
                  size="large"
                  style={{ borderBottom: '1px solid #ddd' }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  className="py-2 px-3"
                  size="large"
                  style={{ borderBottom: '1px solid #ddd' }}
                />
              )}
            />
          </Form.Item>

          {isRegister && (
            <Form.Item
              validateStatus={errors.confirmPassword ? 'error' : ''}
              help={errors.confirmPassword?.message}
            >
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    prefix={<LockOutlined />}
                    placeholder="Confirm Password"
                    className="py-2 px-3"
                    size="large"
                    style={{ borderBottom: '1px solid #ddd' }}
                  />
                )}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-2 text-lg rounded-lg"
              style={{ background: '#4f46e5', borderColor: '#4f46e5' }}
            >
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div className="text-center">
          <Button
            type="link"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-500 hover:text-blue-600 transition duration-300"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
