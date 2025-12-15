
import React from 'react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-bold text-brand-dark-green mb-2">{title}</h3>
        <div className="space-y-2 text-brand-dark-green/80 text-sm">
            {children}
        </div>
    </div>
);

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-background rounded-[2rem] shadow-2xl w-full max-w-3xl h-[90vh] max-h-[800px] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-brand-light-green/50">
          <h2 className="text-xl font-bold text-brand-dark-green">Terms of Service</h2>
          <button onClick={onClose} aria-label="Close terms of service" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <Section title="Data Privacy and Encryption">
                <p>All student data, including chat histories, credentials, and therapy progress, will be stored with end-to-end encryption to ensure full confidentiality and security.</p>
                <p>Sensitive personal information captured during questionnaires or therapy sessions will not be stored or shared.</p>
                <p>Student chat data with the AI chatbot and therapists is retained only temporarily until the student has fully recovered or decides to delete their data.</p>
            </Section>

            <Section title="Data Sharing and Consent">
                <p>Students explicitly agree to share their credentials, progress reports, and therapy updates exclusively with their designated therapists and the platform.</p>
                <p>No data will be shared with governmental bodies or any third parties outside of this scope.</p>
                <p>Students under 18 require parental consent to purchase subscriptions and share relevant information on the platform.</p>
            </Section>

            <Section title="Therapist and Volunteer Confidentiality">
                <p>Therapists and any future peer volunteers are legally bound to keep all student-identifiable data confidential.</p>
                <p>Any breach of confidentiality or unauthorized sharing of student data by therapists or volunteers will be subject to legal action.</p>
            </Section>

            <Section title="Right to Data Deletion">
                <p>Students have the right to request deletion of their personal data and chat histories at any point. The platform commits to promptly honor such requests.</p>
                <p>Once a student recovers fully or the data deletion request is made, all associated information will be permanently erased.</p>
            </Section>

            <Section title="Incident and Breach Reporting">
                <p>In the event of a data breach, therapists are obligated to immediately notify the platform developers.</p>
                <p>The platform will act swiftly to contain any breach and prevent the dissemination of leaked data.</p>
            </Section>

            <Section title="Institutional Reporting">
                <p>Educational institutions will receive only aggregated, anonymized analytics aggregated at the department or cohort level.</p>
                <p>No individual student data or identifiable details will be shared with institutions.</p>
            </Section>

            <Section title="User Agreement">
                <p>By using the platform, students acknowledge and accept these terms, including the encryption and data-sharing provisions.</p>
                <p>Students understand that their therapy progress and personal credentials are shared exclusively with the platform and their assigned therapists for the purpose of treatment and support.</p>
            </Section>
        </div>

        <footer className="p-4 border-t border-brand-light-green/50 text-right">
            <button
              onClick={onClose}
              aria-label="Close terms of service"
              className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors"
            >
              Close
            </button>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;