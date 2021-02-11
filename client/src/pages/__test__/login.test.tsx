import React from "react";

import { screen, render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import Login from "../login";
import { useLogin } from "../../hooks/user";

jest.mock("../../hooks/user");

describe("Login Component", () => {
  it("should render loading state", async () => {
    (useLogin as jest.Mock).mockImplementationOnce(() => ({ loading: true }));

    render(<Login />);

    expect(await screen.findByText(/loading.../i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /vk auth/i })).not.toBeInTheDocument();
  });

  it("should render error state", async () => {
    (useLogin as jest.Mock).mockImplementationOnce(() => ({ error: "error message" }));

    render(<Login />);

    expect(await screen.findByText(/error message/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /vk auth/i })).not.toBeInTheDocument();
  });

  it("should call login function on button click", async () => {
    const loginFnMock = jest.fn();
    (useLogin as jest.Mock).mockImplementationOnce(() => ({ login: loginFnMock }));

    render(<Login />);

    fireEvent.click(await screen.findByRole("button", { name: /vk auth/i }));

    expect(loginFnMock).toHaveBeenCalledTimes(1);
  });
});
