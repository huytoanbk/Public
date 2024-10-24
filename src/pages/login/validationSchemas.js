import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(1, { message: "Vui lòng nhập trường này" }),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .min(1, { message: "Vui lòng nhập trường này" }),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(1, { message: "Vui lòng nhập trường này" }),
    email: z
      .string()
      .email("Email không hợp lệ")
      .min(1, { message: "Vui lòng nhập trường này" }),
    phone: z
      .string()
      .min(1, { message: "Vui lòng nhập trường này" })
      .max(10)
      .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .min(1, { message: "Vui lòng nhập trường này" }),
    confirmPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự")
      .min(1, { message: "Vui lòng nhập trường này" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu không khớp",
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(1, { message: "Vui lòng nhập trường này" }),
});
