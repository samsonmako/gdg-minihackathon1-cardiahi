import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import { base_host } from '../global';


interface User {
  id: number;
    email: string;
      name: string;
      }

      interface AuthContextType {
        user: User | null;
          isAuthenticated: boolean;
            login: (email: string, password: string) => Promise<void>;
              register: (userData: any) => Promise<void>;
                logout: () => void;
                }

                const AuthContext = createContext<AuthContextType | undefined>(undefined);

                export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
                  const [user, setUser] = useState<User | null>(() => {
                      const savedUser = localStorage.getItem('cradiahi_user');
                          return savedUser ? JSON.parse(savedUser) : null;
                            });

                              const login = async (email: string, password: string) => {
                                  try {
                                        const response = await axios.post(`${base_host}api/auth.php?action=login`, {
                                                email,
                                                        password
                                                              });
                                                                    
                                                                          if (response.data.user) {
                                                                                  setUser(response.data.user);
                                                                                          localStorage.setItem('cradiahi_user', JSON.stringify(response.data.user));
                                                                                                }
                                                                                                    } catch (error) {
                                                                                                          throw new Error('Invalid credentials');
                                                                                                              }
                                                                                                                };

                                                                                                                  const register = async (userData: any) => {
                                                                                                                      try {
                                                                                                                            const response = await axios.post(`${base_host}api/auth.php?action=register`, userData);
                                                                                                                                  if (response.data.userId) {
                                                                                                                                          await login(userData.email, userData.password);
                                                                                                                                                }
                                                                                                                                                    } catch (error) {
                                                                                                                                                          throw new Error('Registration failed');
                                                                                                                                                              }
                                                                                                                                                                };

                                                                                                                                                                  const logout = () => {
                                                                                                                                                                      setUser(null);
                                                                                                                                                                          localStorage.removeItem('cradiahi_user');
                                                                                                                                                                            };

                                                                                                                                                                              return (
                                                                                                                                                                                  <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
                                                                                                                                                                                        {children}
                                                                                                                                                                                            </AuthContext.Provider>
                                                                                                                                                                                              );
                                                                                                                                                                                              };

                                                                                                                                                                                              export const useAuth = () => {
                                                                                                                                                                                                const context = useContext(AuthContext);
                                                                                                                                                                                                  if (context === undefined) {
                                                                                                                                                                                                      throw new Error('useAuth must be used within an AuthProvider');
                                                                                                                                                                                                        }
                                                                                                                                                                                                          return context;
                                                                                                                                                                                                          };