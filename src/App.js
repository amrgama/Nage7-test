import React, { useLayoutEffect, useState, createContext, useEffect } from "react";
import axios from "axios";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";

import Header from "Components/Layout/Header";
import Sidebar from "Components/Layout/Sidebar";
import Login from "Views/Auth/Login";
// import ForgotPassword from "Views/Auth/ForgetPassword";
// import ResetCode from "Views/Auth/ResetCode";
// import NewPassword from "Views/Auth/NewPassword";

import strings from "Assets/Local/Local";
import {
  EXAM_DETAILS,
  QUESTION_BANK,
  API_ENDPOINT,
  routePath,
  LangName,
  TokenName,
  UserName,
  PathName,
} from "./AppConstants";
import { cacheLtr, cacheRtl, LTRTheme, RTLTheme } from "./theme";
import innerRouter from "./routes";
import "react-toastify/dist/ReactToastify.css";

export const LangContext = createContext({
  lang: "ar",
  handleLang: (newLang) => { },
});
export const PathContext = createContext({
  path: "",
  handlePath: (newPath) => { },
});
export const UserContext = createContext({
  user: "",
  token: "",
  handleUser: (newUser, newToken) => { },
  clearUser: () => { },
});
export const DrawerContext = createContext({
  isDrawerOpen: true,
  handleDrawer: (newState) => { },
});

//TODO: use pagination in table using keepPreviousData flag
//TODO: initialData or placeholder in Edit
axios.defaults.baseURL = API_ENDPOINT;
const App = () => {
  const defaultLang = cookie.load(LangName) || "ar";
  const defaultToken = cookie.load(TokenName) || "";
  const defaultUser = localStorage.getItem(UserName)
    ? JSON.parse(localStorage.getItem(UserName))
    : "";
  const defaultPath = localStorage.getItem(PathName)
    ? JSON.parse(localStorage.getItem(PathName))
    : {
      ar: "الصفحة الرئيسية",
      en: "Dashboard",
    };

  const [user, setUser] = useState(defaultUser);
  const [token, setToken] = useState(defaultToken);
  const [lang, setLang] = useState(defaultLang);
  const [path, setPath] = useState(defaultPath);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const navigate = useNavigate();
  strings.setLanguage(lang);

  // drawer methods
  const handleDrawer = (newState) => {
    setIsDrawerOpen(newState);
  };
  // lang methods
  const handleLang = (str) => {
    setLang(str);
    cookie.save(LangName, str, { path: "/" });
  };

  // path handle
  const handlePath = (newPath) => {
    // new path is an object {ar:"",en:""}
    setPath(newPath);
    localStorage.setItem(PathName, JSON.stringify(newPath));
  };

  // user methods
  const handleUser = (newUser, newToken) => {
    localStorage.setItem(UserName, JSON.stringify(newUser));
    cookie.save(TokenName, `Bearer ${newToken}`, { path: "/" });

    setUser(newUser);
    setToken(`Bearer ${newToken}`);
  };
  const handleOnlyUser = (newUser) => {
    console.log('handleOnlyUser',newUser,UserName)
    localStorage.setItem(UserName, JSON.stringify(newUser));
    setUser(newUser);
  };

  const clearUser = () => {
    localStorage.removeItem(UserName);
    cookie.remove(TokenName, { path: "/" });
    setUser();
    setToken();
    navigate(`${routePath}login`, { replace: true });
  };

  useLayoutEffect(() => {
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);
  useEffect(() => {
    localStorage.removeItem(QUESTION_BANK);
    localStorage.removeItem(EXAM_DETAILS);

    const onRequest = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers["Authorization"] = token;
      }
      config.headers["Accept-Language"] = lang;
      return config;

    });
    const onErrorResponse = axios.interceptors.response.use(null, (error) => {
      const opts = error.config?._opts ?? {};
      if (
        !opts.noToast ||
        (error.config.method === "get" && opts.toastifyOnGet)
      ) {
        if (error.response) {
          if (error.response.status === 422) {
            toast.error(error.response.data.errors[0].msg);
          } else {
            toast.error(error.response.data.errors);
          }
        } else {
          toast.error(strings.internalErrorTryAgain);
        }
      }
      return Promise.reject(error);
    });
    return () => {
      axios.interceptors.request.eject(onRequest)
      axios.interceptors.response.eject(onErrorResponse)
    }
  }, [lang, token])
  return (
    <LangContext.Provider value={{ lang, handleLang }}>
      <PathContext.Provider value={{ path, handlePath }}>
        <DrawerContext.Provider value={{ isDrawerOpen, handleDrawer }}>
          <UserContext.Provider value={{ user, token, handleUser,handleOnlyUser, clearUser }}>
            <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
              <ThemeProvider theme={lang === "ar" ? RTLTheme : LTRTheme}>
                <ToastContainer />
                <Grid container>
                  {user&&token ? (
                    <>
                      <Grid item xs={12} lg={2}>
                        <Sidebar />
                      </Grid>
                      <Grid item xs={12} lg={10}>
                        <Header />
                        <Box className="main_container">
                          <Routes>
                            {innerRouter.map(({ path, Component }) => (
                              <Route
                                path={path}
                                element={<Component />}
                                key={path}
                              />
                            ))}
                            <Route
                              path="*"
                              element={
                                <Navigate to={`${routePath}dashboard`} replace />
                              }
                            />
                          </Routes>
                        </Box>
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12} lg={12}>
                      <Routes>
                        <Route path={`${routePath}login`} element={<Login />} />
                        {/* <Route
                          path={`${routePath}forget-password`}
                          element={<ForgotPassword />}
                        />
                        <Route
                          path={`${routePath}forget-password/code`}
                          element={<ResetCode />}
                        />
                        <Route
                          path={`${routePath}forget-password/new-password`}
                          element={<NewPassword />}
                        /> */}

                        <Route
                          path="*"
                          element={<Navigate to={`${routePath}login`} replace />}
                        />
                      </Routes>
                    </Grid>
                  )}
                </Grid>
              </ThemeProvider>
            </CacheProvider>
          </UserContext.Provider>
        </DrawerContext.Provider>
      </PathContext.Provider>
    </LangContext.Provider>
  );
};

export default App;
