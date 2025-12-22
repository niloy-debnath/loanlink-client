import { useEffect } from "react";

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `${title} | LoanLink`;
  }, [title]);

  return null;
};

export default PageTitle;
