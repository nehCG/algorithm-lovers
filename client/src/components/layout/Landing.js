import React from 'react'

const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Algorithm Lovers</h1>
          <p className="lead">
            Create a profile/portfolio, share and discuss algotihms with
            other algorithm enthusiasts
          </p>
          <div className="buttons">
            <a href="/register" className="btn btn-primary">
              Sign Up
            </a>
            <a href to="/login" className="btn btn-light">
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing
