import Link from 'next/link'
 
export default function Home() {
  return (
    <div className='homepage'>
    <div className='homepage-container'>
      <h1 className='title'>Emergency Assistant</h1>
      <p className='description'>Your AI-Powered Emergency Assistant</p>
      <p className='description'>Get instant first-aid instructions and send emergency alerts.</p>
      <p className='description'>Click the buttons below to get started.</p>
      <div className='links'>
      <Link className='sticky-link' href="/first-aid">AI First-Aid Guide</Link>
      <Link className='sticky-link' href="/detectEmergency">Emergency Button</Link>
      </div>
    </div>
    </div>
  )
}