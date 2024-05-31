import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer({user}) {
  // if no user is logged in
  if (!user) {
    return (
      <footer className='footer-logged-out'>
        <small className='footer-language'>
          English (US)
        </small>
        <div>
          <small className='footer-copy-logged-out'>
            Lookbook &copy; {(new Date()).getFullYear()}
          </small>
          <ul className='footer-links-logged-out'>
            <li><a href='https://github.com/seanliyuxiang/lookbook-fb-clone' target='_blank'><GitHubIcon fontSize='small' />GitHub</a></li>
            <li><a href='https://www.linkedin.com/in/seanliyuxiang' target='_blank'><LinkedInIcon fontSize='small' />LinkedIn</a></li>
            {/* <li><a href='https://medium.com/@seanliyuxiang' target='_blank'>Medium</a></li> */}
          </ul>
        </div>
        <small className='footer-tech-stack'>
          Lookbook is a clone of Facebook built using Ruby, Rails, PostgreSQL, JavaScript, React, HTML, and CSS.
          Check out its code <a href='https://github.com/seanliyuxiang/lookbook-fb-clone' target='_blank'>here</a>!
        </small>
      </footer>
    );
  }

  // if an user is logged in
  return (
    <footer className='footer'>
      <small className='footer-copy'>
        Lookbook &copy; {(new Date()).getFullYear()}
      </small>
      <ul className='footer-links'>
        <li><a href='https://github.com/seanliyuxiang/lookbook-fb-clone' target='_blank'><GitHubIcon fontSize='small' />GitHub</a></li>
        <li><a href='https://www.linkedin.com/in/seanliyuxiang' target='_blank'><LinkedInIcon fontSize='small' />LinkedIn</a></li>
        {/* <li><a href='https://medium.com/@seanliyuxiang' target='_blank'>Medium</a></li> */}
      </ul>
    </footer>
  );
}

export default Footer;