// pages/VisitPage.jsx
import React from 'react';
import VisitorForm from '../components/community/VisitorForm';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const VisitPage = () => {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-base-100 py-20">
        <VisitorForm />
      </main>
      <Footer />
    </>
  );
};

export default VisitPage;