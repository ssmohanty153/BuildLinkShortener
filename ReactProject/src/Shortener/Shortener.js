import React, { useState } from "react";
import axios from "axios";

export default function Shortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/shorten", {
        originalUrl: url,
      });
      setShortUrl(res?.data?.shortUrl);
    } catch (err) {
      setShortUrl("");
      alert("please enter valid url");
      console.error(err);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter URL to shorten
                </label>
                <div className="mt-1">
                  <input
                    id="url"
                    name="url"
                    type="text"
                    autoComplete="url"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Make Shorten URL
                </button>
              </div>
              {shortUrl && (
                <div>
                  <div>
                    <label
                      htmlFor="shortUrl"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Short URL
                    </label>
                    <div className="mt-1">
                      <input
                        id="shortUrl"
                        name="shortUrl"
                        type="text"
                        autoComplete="short-url"
                        readOnly
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={shortUrl}
                      />
                    </div>
                  </div>

                  <p>
                    Short URL: <a href={shortUrl}>{shortUrl}</a>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
