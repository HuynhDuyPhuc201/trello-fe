import { Link } from 'react-router-dom'
import { path } from '~/config/path'

const Home = () => {
  return (
    <div>
      <ul>
        <li>
          Home
          <li>
            <Link to="/boards/680c5df4dd56a0e4942ecc33">Board</Link>
          </li>
          <li>
            <Link to={path.Login}>Login</Link>
          </li>
        </li>
      </ul>
    </div>
  )
}

export default Home
