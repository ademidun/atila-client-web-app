import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

//https://github.com/ReactTraining/react-router/issues/2019#issuecomment-299576935
function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return null;
}

export default ScrollToTop;