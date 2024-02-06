import React from "react";
import Container from "@/app/_components/container";
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import Link from 'next/link';
import Image from 'next/image';
// import logofooter from '../public/logo_orange.png'; // Adjust path as needed, assuming the image is in the public directory

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#343a40", color: "white", textAlign: "center", padding: "20px" }}>
      <Container>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <div>
            {/* Uncomment and correct the path to use the Image component
            <Image src={logofooter} alt="footer logo" width={120} height={60} style={{ marginBottom: "10px" }} />
            */}
            <p>AI-driven real-time coaching.</p>
          </div>
          <div>
            <h6>Tools</h6>
            <Link href="/cyclingevents" passHref><InstagramIcon style={{ color: "white", display: "block", marginBottom: "5px" }} /></Link>
            <Link href="/bikefit" passHref><TwitterIcon style={{ color: "white", display: "block", marginBottom: "5px" }} /></Link>
          </div>
          <div>
            <h6>About Us</h6>
            <Link href="https://forum.enduroco.in" passHref><p style={{ color: "white", marginBottom: "5px" }}>Forum</p></Link>
            <Link href="https://servicestatus.enduroco.in" passHref><p style={{ color: "white", marginBottom: "5px" }}>Service Status</p></Link>
            <Link href="/privacypolicy" passHref><p style={{ color: "white", marginBottom: "5px" }}>Privacy Policy</p></Link>
          </div>
          <p>Follow us on:</p>
          <div>
            <Link href="https://www.instagram.com/enduroco_in/" passHref><InstagramIcon sx={{ color: "white", marginRight: "10px" }} /></Link>
            <Link href="https://twitter.com/enduroco_ai/" passHref><TwitterIcon sx={{ color: "white" }} /></Link>
          </div>
          <p>© 2024 EnduroCo</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
