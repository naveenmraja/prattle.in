import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomeView from "./views/HomeView";
import ChatView from "./views/ChatView";
import Header from "./components/Header";
import {getEnvironmentVariable} from "./utils/Constants";
import * as Constants from "./utils/Constants";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";

const container = document.getElementById('root');
const root = createRoot(container);
const googleSiteKey = getEnvironmentVariable(Constants.GOOGLE_SITE_KEY)

root.render(
    <Provider store={store}>
        <Router>
            <Header />
            <GoogleReCaptchaProvider reCaptchaKey={googleSiteKey}
                                     container={{
                                         element: "[required_id_or_htmlelement]",
                                         parameters: {
                                             badge: '[inline|bottomright|bottomleft]',
                                             theme: 'dark'
                                         }}}>
                <Routes>
                    <Route path="/">
                        <Route index element={<HomeView />} />
                        <Route path="chat" element={<ChatView />} />
                        <Route path="*" element={<HomeView />} />
                    </Route>
                </Routes>
            </GoogleReCaptchaProvider>
        </Router>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
