// ./src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// AppContainer is a necessary wrapper component for HMR
import App from './components';

if (process.env.NODE_ENV === 'production') {
    ReactDOM.render(<App />, document.getElementById('app-root'));
} else {
    const render = (Component) => {
        ReactDOM.render(
            <AppContainer>
                    <Component />
            </AppContainer>,
            document.getElementById('app-root'));
    };

    render(App);
    if (module.hot) {
        module.hot.accept('./components', () => {
            render(App);
        });
    }
}
