import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to home if no data (user manually opened /analysis)
  if (!location.state) {
    navigate("/");
    return null;
  }

  const { sentiment, spam, bias } = location.state;

  return (
    <div>
      <Header></Header>
    <div className="min-h-screen bg-[#111418] text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-4">Review Analysis Results</h1>

      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-[#1a1e23] p-6 rounded-md border border-gray-700">
          <h2 className="text-xl font-bold">Sentiment Analysis</h2>
          <p className="text-2xl text-green-400">{sentiment?.label}</p>
          <p className="text-gray-400">Confidence: {sentiment?.confidence}%</p>
        </div>

        <div className="bg-[#1a1e23] p-6 rounded-md border border-gray-700">
          <h2 className="text-xl font-bold">Spam Detection</h2>
          <p className="text-2xl text-yellow-400">{spam?.label}</p>
          <p className="text-gray-400">Confidence: {spam?.confidence}%</p>
        </div>

        <div className="bg-[#1a1e23] p-6 rounded-md border border-gray-700">
          <h2 className="text-xl font-bold">Bias Identification</h2>
          <p className="text-2xl text-blue-400">{bias?.label}</p>
          <p className="text-gray-400">{bias?.description}</p>
        </div>

        <button
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-bold"
          onClick={() => navigate(-1)} // go back to write review page
        >
          Submit Another Review
        </button>
      </div>
    </div>
    <Footer></Footer>
    </div>
  );
};

export default AnalysisPage;
