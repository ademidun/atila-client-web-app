import React from "react";
import './Invoice.scss'
import {connect} from "react-redux";
import {UserProfilePropType} from "../../models/UserProfile";
import moment from "moment";

// source: https://github.com/sparksuite/simple-html-invoice-template
const logoImageData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEA8QEhAQFREQDxYQExAOFRAVEBUQFxcXFhUXFRYYHSggGBolHRUVITIhJSorLi4uGCAzODMtNygtLisBCgoKDg0OGhAQGy0lHyUwLjUtLS0rLS0tKy0tLS0tLSstLTUwLSstLS0tLS0tLS4tLS0tLi0uLS0tKy0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAABAECAwUHBv/EAEkQAAIBAgMDCAUJBQYFBQAAAAECAAMRBBIhBTFRBhMiQWFxgZEUMkJyoQcjUmJzgrGzwTM2U7LCQ5Ki0dLhVGODk/EVFiY0Nf/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAlEQEBAAIBBAIBBQEAAAAAAAAAAQIRAyExQVEScQQiI8Hh8BP/2gAMAwEAAhEDEQA/AO4xEQEREBERAREQEREBEpeYHxtJTYut/og3byGsCREi+mg+qlU/cZf57SnpT/wKvnQ/1xpNpcSIMU/8Cr50P9cr6aB6yVR9xm+K3jRtKiYKeMpsbB1vwJs3kdZmvCqxEQEREBERAREQEREBERAREQEREBERARKEyJ6Q1TSlbL/FOq/cHtd+7vgZ6+IVACxtfcN5J4ADUnumHnKr+qoQfSq6t4ID+J8Jkw+FVCTqWO931Y+PUOwWEzwiIMCp9dnc/XPR/uLZfhJFOmqiyqAOCgAS+IXRERASlpWIFlSkrCzKCODAEfGRzgQPUZ0903XuyNdfICS4g0ic7VT1lDj6VLRvFCfwJ7pmo11cXVgbaEdYPAg6g9hmWYK+FVjm1VxudNGHZ2jsNxCM8SGMS1PSra3VVXRPvD2T27u7dJcLtWIiAiIgIiICIiAiIgIiICWVagUFiQANSTuAlXYAEk2AFyTuAkSkhqkOwsgN6aHeeDsOPAdW867iApmtq4Ip9VM727anZ9Xz4CYBKxCkREBERAREQEREBERAREQKEX04yGUNHVbml1oLlkHFOI+r5cJNiEW06gYAgggi4I1BHZLpCqKaJLr+zJu6j2T1uo/EeO+95isDa2617jdArERCkREBERAREQERI+MqkAKvrucq9nFj2Aa+Q64GJvnXy/2aHpfXcez7o6+JsOoyZLKFIIoUbgLdveeJmSEhERCkREBERAREQEREBERAREQEREBIVP5pwn9m56HBX3lO46keI4CTZjxFEOpU7jw3g7wR2g6wjJEj4OsWBDeuhyP38R2EEHxkiFIiICIiAiIgDImG6bvU6gTTTuB6R8W0+6JfjqhVGy+sbIvvsQoPmbzJQphFVRuUADuEIyREQpETDjMStKnUqubJTQux4KouT5CBmic3+TPlbUxWJxlKsxJqscRRDEnKvqsi8ABk096dIm+TC4XVYwzmc3CIkTH7Qp0Obzm3O1UooBqTUc2A/XuBmG0uUJic95Zcjsbi9oUMTRrKtNFQAlmD0ipJYqoGt/8AzN4YzK6t0xnlZOk26HKEzBjadRqbLTqCm53VCofLrr0SRfS84+BiE2/Qo18RUrGlilyu+gysmYWQaLo1tOE1x8fz317Jycnw107u0RKCVnJ0IiICIiAiIgRK/QqLU6mtTfx9Q/3jb70lzHiKQdGU+0LX6x2iWYKqXRSfW3N76nK3xBhGeIiFIiICIiBFr9KrSXqUNUPgMo/mJ8JKkWhrVrH6OSn5DP8A1iSoSEREKTxXyk4pqiYbZtInncfWCNbetBSC5PZ+gM9oZ4LkvVXG7Sxu0WZebon0PDZiB0V9dhfjff8AXM68U1bl6/0cuS9Jj7eI2/hDsbatOpSDc2pWvTGvSpHo1Ev1nRh4idxw9ZaiK6G6uoZWG4qRcGeE+VrZqV8ItdGU1MK2bQi5pNYOPgp8Jk+SPbPPYM4dj08K2UceZa5Ty6Q8BOvL+5xzPzOlc+P9HJcfF7PaYzErSpvUfNlRcxyqzNbsVQSfCcd29ywfE7SwjtTrJh8NiEdKLI3PNqLuU3liNw4d5naZyLlT+8mG+0w0n42t3c8VfyN6n26BsblPQxRqBUxFMU0zs2JpPSTL7zaTXbQ+UPAU6qUabtWd6i0/mACiliFuXJAPheerq01YFWAKsCCrAFSDvBB3icc+UXCpT2xhciqocYdyFAAzc6y3sOuyjymeHDDPLS8uWWGO3ZZyLa37z0/tqP5Czrs5Ftb956f21H8lZfx++X1Tn7T7jrhNtT1dc8t/74o1KlSnhcPisUafrthlTmh992F9x3b5t+UuBqYjB4qhTYLUq0WRSSQLkWsSNwO7xmk5B7IbZmCdcU9JC1ZqrHMMiqVVQCxsL9G/jOeMx+Nt7+m8rl8tTt7Zti8ucLia/ozLWoYi5XmsSoUlhvAIJF+w2vPUziPLjamHrbVw2IwzhwOZBdQwQulQ6gkdIWsLjTSdumuXjmMlnlnizuVsvgiInF2IiICRcP0alVeOWoPvDKfihPjJUi1dK1M/SVk8dGH4NCVKiIhSIiAgxKQIuA1FRvpVn/wnmx8EElyJsz9mftav5ryXLUnYiJZXcqrMFLEAkKtrseAvpc9sivOfKFtdsNgqgp/tsQww1EDfnfQkdoW577SJsr5O9npQorVw6vVWmA7lqnSe3SOhtvmj23h9rYnH4bFHAHmcK4ZKDVqFzxYm9s263CwnQ9n4h6iBnovSa5HN1DTZu+6Ei075W4YyY371XCSZ5W2fTRH5P9lf8IneGq3/AJpzTktXbZO1zQqHoGocNUJ0BRiDTf8AkPcTO31XIViFLEAkKLXJ4C+k5Fy05N7Rx+LbEJgWprzapZqtDMct+kbNYHW2nCdODP5bxzvS+6xzYa1cZ1jsE5FyqP8A8jw32uG/ET3HJLF4/m6dHGYRldEy+kCpSZWsNCyhrhj2XHXpunmPlE5L4ypjKWOwiZ2UU7qpXOtSm11axIzDd5TPDrHOy3xWubeWEsnl0uch+U7/APYwXuUPznnueT67RbNicYFVhSK0sHhzYcSzksQXJAA1sB3meL5XbD2pjccuKTBMq0hTVEepQuQjF+lZuskxwSY53dnZObeWHSOszkW1v3np/bUfyVnTMNj6zUWqNhKqVF/sC9AsxsPVYNltqd5G6c2xmxNqvtT/ANRGBNhWVxSNWhfIqhLE5t5A8zJwdLlu+F5usmvboXK3bgwOEq4jLmZbKincajHKt+y5uewTyvIzZB2ig2hj3NdnduZoN/8AXpqrEXFPcTcHffS3XN9yl2XU2ls+rSNNqNUkMi1ih6aEFblCwsbW8d08ZyUobewQbCphUNMsSrYkg06bHeQytcr12tLxyf8AO6usv4M7fnNzowfKogXaWBAAAFOkAALAfOndOvXnI+WfI3aLVsPXVnxVVlHOOMiqlQNdQiEjLT89xvvnu9l+n0kWpiFFatXrIr0qLKlHDUbHVc2rW3nW5J00EcurhjqnHbM8txMxfKLD0mIZmyistBqoUmktZrBUZuNyB2Ei9pR+UeHFQ08zaYhcKzhWNNcQwBFMtx6S9mtr3mp2XRxuGevhvRxUp1MU9elii6c2qVX5xucUnMWUk2A36ajfIG1NnY6pUdjhmc09pUsRTZalJaRwyMhsqXHzmhuW17dwmJhjv+27nlp7yJahNhfQ21G/WXTi6ki43Q0TwrD4hl/WSpE2iein21L8xYiVLiIhSIiAlDKykCNs3RGHCrV/McyVImE0euP+aGHcUX9c0ly1IRESKpKxEBKSsQKSsRASkrEClolbxAREQKRKxApaViICIiAkXH7qY41k+DZv6ZKkXE61KA+sz+AUj8WERKlREQpERAREQIvq1/tKfxQ/5P8ACSpFx+gSp/DcE+6eix7gGv4SUIQiIhUbF4QVLXaotv4bMvnbfNVszD3w/PGpVLZKmjOxX2l3Gb4zW7PwzrhebYWfK4tpvJa34iBF2btJkpYcNScU2CUxVJHrEWBy77E9cm1toNndKdJqnN2zkMFAJF8ovvNpHfCVDhsPTy9JGpFhcaZSM0w1Nn5atZjQNVajZ1KsAQbaggkaX64G3wmIWqi1FvlcXF9/jPOPXW1cnEVRXFaoKdNXYk2boAJ1jqnosFTC00UIEsPUBuF7L9c1q7MLUcQjCzNWqVKbaXBJuhuN0DPznzuGDhucak17GyAgLmuvXMVTbLBc60S1M1ObD5lF2vlvY7hfrly06rVMLUdbZKTipqNGIH+RmpwylaK13RnpK5q2FWyk5jZxTy/C8DYPiHXF1ctNnY0E6IIAGrXuTpGK2s7U6L00IzVgjAlbghrFDfjxkyhRb0ipUt0GooAdN4JJ/ESC2Cqilol2XGGsEuASmcnQ7t0DcoSydIFSRqLgkeImlTEv6IUzHnRU9GzEnNnzZQb79xvN3RclQSpUnepIJHlNScA/pWa3zJYVybj9qFK2t5GBhOLdsIi5iKrOMPe5zZw2Um/GwJk/FY2pTDEUGZKY1fMoJAGpAOpkWls9xiibfMhzXB0/asoUi3mZhx2Bqu2IDUjUL35py9kRbfRvoR3awNpQx4eoadiPmlqqx9pT2dVpfgMXzylwtlzsqk+0AbZvxmo2vRdKWGddKqqKFuOdctu8Gx8JusJQFNEQbkUL5QM0REBIo1rH6lMDxc3PwVfOSTIuz9Vap/FcuPd0VP8ACqnxhEuIiFIiICIiBbUQMCpFwQQQesHfMGAc5crG7UzkY8bbj4qQfGSZExHzdRanstam/Zr0G8yR94cIRLiIhSIiAiIgIiICQhsqhmzc0l733aX423Xk2ICIiAiIgIiIGKrQVipZQShzLfqbdeZYiAiIgRce11CDfVOTuG9j4KD42klQAABuGgHZImG6btV9kXSn7t+k3iR5KD1yZCEREKREQEREBLaiBgVIuCCCDuIO8S6IEXCVCCaTHpKLgne6bg3f1Ht7xJUwYqhmAKmzrqrdvWDxB6/9hK4avnB0symzKd6tw/36xCM0REKREQEREBERAREQEREBERAREQEiYtyxFJSbsLsR7NPcT3ncPE9UyYrEZALC7NoqjeT+g4nqjC0MgNzd2OZm4t2cANwEIyooAAAsALADcBLoiFIiICIiAiIgIiICRcThzcOhAqDTX1WX6LdnA9XmDKiBhw+IDjcQQbMresp7f8+uZpHxGGzEMDlcbnHDgR7S9n4HWW0sVYhKgyudB9BvdP6HXv3wiVERCkREBERAREQEREBERATDicQEA0JZtFQb2P6Dt6pjqYkklaYzMNCT6i+8es/VGvdvl+HwwW7Elnb1nO89g4DsEItw1Agl3INRhYkblH0V7Px+AkxEKREQEREBERAREQEREBERASyrTVgVYAg7wRcS+IEQUqlP1DnX6FQ9Ie6/X96/fLqWMUkKbqx9ipoT3dTeBMkyypSVhZlBB6mAI+MIviRPQ8vqO69l8y+TXsO60reuOqm/dmQ/1QbSokU4pxvo1O9TTYfzX+Eocco3pW/7VQ/gDGjaXEiDHA7krH/p1B+IEqMU53UanexpgfzX+EaNpUSLeueqmn95z/THoeb13d+wnKvktrjvvArUxqg5Vu7D2aepHedy+JEtNGpU9c5V+hTJufeff4C3eZIp01UAKAANwUADyl8CynTCgAAADcBoBL4iFIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIH/2Q=="
function Invoice({ userProfile }) {

    console.log({userProfile});

    const { first_name, last_name, email } = userProfile;
    const todayString = moment(Date.now()).format('MMMM DD, YYYY');
    return (
        <div className="invoice-box">
            <table cellPadding="0" cellSpacing="0">
                <tbody>
                <tr className="top">
                    <td colSpan="2">
                        <table>
                            <tbody>
                            <tr>
                                <td className="title">
                                    <img src={logoImageData}
                                         style={{maxHeight:'75px'}} alt="atila logo" />
                                </td>

                                <td>
                                    Date: {todayString}<br />
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </td>
                </tr>

                <tr className="information">
                    <td colSpan="2">
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    Atila Tech.<br />
                                </td>

                                <td>
                                    {first_name} {last_name}<br />
                                    {email}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>

                <tr className="heading">
                    <td>
                        Item
                    </td>

                    <td>
                        Price
                    </td>
                </tr>

                <tr className="item">
                    <td>
                        Atila Student Premium
                    </td>

                    <td>
                        $9
                    </td>
                </tr>

                <tr className="item last">
                    <td>
                        HST (13%)
                    </td>

                    <td>
                        $1.17
                    </td>
                </tr>

                <tr className="item total">
                    <td>
                        Total: $10.17
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

Invoice.defaultProps = {
    userProfile: null
};
Invoice.propTypes = {
    userProfile: UserProfilePropType
};

const mapStateToProps = state => {
    return {
        userProfile: state.data.user.loggedInUserProfile,
    };
};

export default connect(mapStateToProps)(Invoice);