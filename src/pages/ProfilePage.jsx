import React, { useContext } from "react";
import PageWrapper from "../components/PageWrapper";
import { ThemeContext } from "../context/ThemeContext";

export default function MLEngineerDetails() {
  const { theme } = useContext(ThemeContext);

  // --- Profile Data ---
  const gitHubUrl = "https://github.com/Yafai01";
  const emailAddress = "waledyafai31@gmail.com";
  const name = "Yafai";
  const role = "AI/ML Engineering Student at VREC";
  // Sad, reflective quote
  const sadQuote = "A thing isn't beautiful because it lasts. It's a privilege to be among them.";
  // --------------------------------------------------

  // --- Dr. Strange Theme Style Constants ---
  const primaryAccent = '#2a2a6e'; // Deep indigo/midnight blue (Dr. Strange's cape/magic)
  const secondaryAccent = '#a0522d'; // Sienna/Rust orange (Eye of Agamotto/magic glow)
  const textColorLight = '#333333';
  const textColorDark = '#e0e0f8'; // Light lavender/blue for dark theme text
  const backgroundColorLight = '#f8f8f8'; // Off-white
  const backgroundColorDark = '#10103a'; // Very dark indigo

  // --- Professional Card Style ---
  const cardStyle = {
    padding: '30px',
    borderRadius: '15px',
    boxShadow: theme === 'light' ? '0 8px 20px rgba(0, 0, 0, 0.1)' : '0 8px 20px rgba(0, 0, 0, 0.3)', // Deeper shadow for dark theme
    backgroundColor: theme === 'light' ? '#ffffff' : backgroundColorDark,
    color: theme === 'light' ? textColorLight : textColorDark,
    border: `1px solid ${theme === 'light' ? '#d0d0e0' : primaryAccent}`,
    marginTop: '30px',
  };

  // --- Text Styles ---
  const labelStyle = {
    fontWeight: '700',
    minWidth: '150px',
    display: 'inline-block',
    marginRight: '15px',
    color: theme === 'light' ? '#5c5c9e' : '#b0b0d0', // Muted purple/blue for labels
  };

  const valueStyle = {
    display: 'inline-block',
    fontWeight: '600',
    fontSize: '1.1rem',
  };

  const linkStyle = {
    color: secondaryAccent, // Use the orange/gold for links
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  };

  const headingStyle = {
    marginBottom: '20px',
    fontSize: '1.6rem',
    borderLeft: `5px solid ${primaryAccent}`,
    paddingLeft: '15px',
    color: theme === 'light' ? primaryAccent : secondaryAccent, // Mix of primary and secondary for headings
  };

  // --- Quote Block Style (Highlighted - No Typewriter Effect) ---
  const quoteBlockContainerStyle = {
    borderLeft: `8px solid ${secondaryAccent}`, // Highlight with secondary accent color
    padding: '20px 25px', // More padding for visual emphasis
    margin: '30px auto 0 auto',
    maxWidth: '700px',
    backgroundColor: theme === 'light' ? '#f0e0f8' : '#1f1f4a', // Light purple/darker indigo for quote background
    borderRadius: '10px', // Slightly more rounded
    boxShadow: theme === 'light' ? '0 4px 10px rgba(0,0,0,0.05)' : '0 4px 10px rgba(0,0,0,0.2)', // Subtle shadow
  };

  const quoteTextStyle = {
    color: theme === 'light' ? primaryAccent : textColorDark, // Deep blue or light text for quote
    fontSize: '1.8rem', // Larger font size
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'center', // Centered for prominence
    lineHeight: '1.4',
    margin: '0',
  };
  // -------------------------------------------------------------------------------


  return (
    <PageWrapper>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* SAD IRON MAN QUOTE (Highlighted Block - Dr. Strange Theme) */}
        <div style={quoteBlockContainerStyle}>
          <p style={quoteTextStyle}>
            {sadQuote}
          </p>
        </div>

        <h2 style={{
          borderBottom: `3px solid ${primaryAccent}`,
          paddingBottom: '10px',
          marginBottom: '30px',
          color: theme === 'light' ? textColorLight : textColorDark,
          textAlign: 'center',
          marginTop: '30px',
          fontSize: '2rem', // Larger main title
          fontWeight: 'bold',
        }}>
          Mystic Arts Master Details
        </h2>

        <div className="card" style={cardStyle}>

          {/* Master Info Section */}
          <h3 style={headingStyle}>
            Master Info
          </h3>

          <div style={{ marginBottom: '25px', paddingLeft: '15px' }}>
            <p style={{ marginBottom: '15px' }}>
              <span style={labelStyle}>Name:</span>
              <strong style={valueStyle}>{name}</strong>
            </p>
            <p style={{ marginBottom: '15px' }}>
              <span style={labelStyle}>Role:</span>
              <span style={valueStyle}>{role}</span>
            </p>
          </div>

          <hr style={{ borderTop: `1px solid ${theme === 'light' ? '#c0c0c0' : '#4a5568'}`, margin: "30px 0" }} />


          {/* Contact Section */}
          <h3 style={headingStyle}>
            Connect
          </h3>

          <div style={{ marginBottom: '10px', paddingLeft: '15px' }}>
            <p style={{ marginBottom: '15px' }}>
              <span style={labelStyle}>Email Address:</span>
              <span style={valueStyle}>
                <a href={`mailto:${emailAddress}`} style={linkStyle}>{emailAddress}</a>
              </span>
            </p>

            <p>
              <span style={labelStyle}>GitHub Profile:</span>
              <span style={valueStyle}>
                <a href={gitHubUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  {gitHubUrl.replace('https://github.com/', '@')}
                </a>
              </span>
            </p>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}