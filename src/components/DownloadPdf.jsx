import { CloudDownload } from '@material-ui/icons';
import React from 'react';

const DownloadPdf = () => {
  return (
    <div className="download-container">
      <h2 className="title">Sample Bookkeeping deliverables</h2>
      <div className='download-file-section'>
    <a href="https://task-elephant-public.s3.amazonaws.com/ABC_Company_Statement_of_Cash_Flows.pdf" download="ABC_Company_Statement_of_Cash_Flows.pdf" className="download-button" target='_blank'>
        <span className="icon"><CloudDownload fontSize="large" /></span> ABC Company Statement of Cash Flows
    </a>
    <a href="https://task-elephant-public.s3.amazonaws.com/ABC_Company_Statement_of_Financial_Position.pdf" download="ABC_Company_Statement_of_Financial_Position.pdf" className="download-button" target='_blank'>
        <span className="icon"><CloudDownload fontSize="large"/></span> ABC Company Statement of Financial Position
    </a>
    <a href="https://task-elephant-public.s3.amazonaws.com/ABC_Company_Statement_of_Revenue_%26_Expenses.pdf" download="ABC_Company_Statement_of_Revenue_and_Expenses.pdf" className="download-button" target='_blank'>
        <span className="icon"><CloudDownload fontSize="large"/></span> ABC Company Statement of Revenue & Expenses
    </a>
</div>

    </div>
  );
};

export default DownloadPdf;
