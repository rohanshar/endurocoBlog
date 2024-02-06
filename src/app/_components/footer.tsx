import React from "react";
import Container from "@/app/_components/container";
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import Image from 'next/image';
import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#343a40", color: "white", textAlign: "center", padding: "20px" }}>
      <Container>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <div>
            <Image src="/assets/logo_orange.png" alt="footer logo" width={120} height={60} priority />
            <p>AI-driven real-time coaching.</p>
          </div>
          <div>
            <h6>Tools</h6>
            {/* For internal links, use Link without an <a> tag around the icon. */}
            <Link href="/cyclingevents" passHref>
              <InstagramIcon style={{ color: "white", cursor: "pointer", display: "block", marginBottom: "5px" }} />
            </Link>
            <Link href="/bikefit" passHref>
              <TwitterIcon style={{ color: "white", cursor: "pointer", display: "block", marginBottom: "5px" }} />
            </Link>
          </div>
          <div>
            <h6>About Us</h6>
            {/* For external links, use <a> directly without Link. */}
            <a href="https://forum.enduroco.in" style={{ color: "white", marginBottom: "5px" }}>Forum</a>
            <a href="https://servicestatus.enduroco.in" style={{ color: "white", marginBottom: "5px" }}>Service Status</a>
            <a href="/privacypolicy" style={{ color: "white", marginBottom: "5px" }}>Privacy Policy</a>
          </div>
          <p>Follow us on:</p>
          <div>
            <a href="https://www.instagram.com/enduroco_in/" style={{ color: "white", marginRight: "10px" }}><InstagramIcon /></a>
            <a href="https://twitter.com/enduroco_ai/" style={{ color: "white" }}><TwitterIcon /></a>
          </div>
          <p>© 2024 EnduroCo</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
