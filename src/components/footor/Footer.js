
import "./Footer.css";

import {GitHub , LinkedIn, Facebook} from '@mui/icons-material';

const Footer = (props) => {

  return (
    
    <footer className= {`${props.theme? "darkFooter":"lightFooter"}`}>
      <a
        href="https://github.com/AhmedAbdelerhman"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHub/>
      </a>

      <a
        href="https://github.com/JuliaKnaeble/circle-cast-react"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedIn/>
      </a>

      <a
        href="https://www.facebook.com/profile.php?id=100009450207309"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook/>
      </a>
    </footer>
  );
};

export default Footer;
