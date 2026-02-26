// Mock for react-router-dom v7 - Jest compatibility
import React from 'react';

const mockNavigate = jest.fn();

export const BrowserRouter = ({ children }) => <div>{children}</div>;
export const Routes = ({ children }) => <div>{children}</div>;
export const Route = ({ element, children }) => <div>{element !== undefined ? element : children}</div>;
export const Link = ({ children, to, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
);
export const NavLink = ({ children, to, className, ...props }) => (
  <a href={to} className={typeof className === 'function' ? className({ isActive: false }) : className} {...props}>
    {children}
  </a>
);
export const Navigate = () => null;
export const useNavigate = () => mockNavigate;
export const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null });
export const useParams = () => ({});
export const useSearchParams = () => [new URLSearchParams(), jest.fn()];
export const Outlet = () => null;

export default {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Outlet,
};
