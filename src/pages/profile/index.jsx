import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, notification } from "antd";
import axios from "axios";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "current_username",
      email: "current_email@example.com",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        "https://jsonplaceholder.typicode.com/posts/1",
        data
      );
      if (response.status === 200) {
        notification.success({
          message: "Profile updated successfully",
        });
        setIsEditing(false);
      }
    } catch (error) {
      notification.error({
        message: "Failed to update profile",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          User Profile
        </h2>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Form.Item
            label="Username"
            validateStatus={errors.username ? "error" : ""}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              rules={{ required: "Username is required" }}
              render={({ field }) => <Input {...field} disabled={!isEditing} />}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => <Input {...field} disabled={!isEditing} />}
            />
          </Form.Item>

          {isEditing ? (
            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-2 text-lg rounded-lg"
            >
              Save Changes
            </Button>
          ) : (
            <div>
              <Button
                type="primary"
                htmlType="button"
                className="w-full py-2 text-lg rounded-lg"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
              <Button hidden htmlType="submit"></Button>
            </div>
          )}
        </Form>

        {!isEditing && (
          <Button
            className="w-full py-2 mt-4 text-lg rounded-lg"
            onClick={() => reset()}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
