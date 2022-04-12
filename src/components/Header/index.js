import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'
import './index.css'

class Header extends Component {
  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <div className="header-main-container">
        <div>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
              alt="website logo"
              className="header-logo-image"
            />
          </Link>
        </div>
        <ul className="header-list">
          <Link className="header-listItem" to="/">
            <li>Home</li>
          </Link>
          <Link className="header-listItem" to="/jobs">
            <li>jobs</li>
          </Link>
        </ul>
        <div>
          <button
            type="button"
            onClick={this.onClickLogout}
            className="header-logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
