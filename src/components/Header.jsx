import { Link } from 'react-router-dom'

export function Header() {
  return (
    <div>
      <h1>Welcome To My Blog!</h1>
      <h2>
        <Link to='/signup'>Sign Up</Link>
      </h2>
    </div>
  )
}
