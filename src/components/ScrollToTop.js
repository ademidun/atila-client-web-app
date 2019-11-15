import React from "react";
import { withRouter } from "react-router-dom";

//https://github.com/ReactTraining/react-router/issues/2019#issuecomment-299576935
class ScrollToTop extends React.Component {
    componentDidUpdate(prevProps) {
        if (
            this.props.location.pathname !== prevProps.location.pathname
        ) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return null;
    }
}

export default withRouter(ScrollToTop);