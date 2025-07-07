
export default function Loader({loading}) {
  return (
    <>
     {loading && (
       <div className="loading-container">
            {[...Array(3)].map((_, index) => (
            <div key={index} className="loading-row">
            <div className="loading-bar" style={{ "--bar-index": index }}></div>
            </div>
            ))}
        </div>
    )}
    </>
 )
}
