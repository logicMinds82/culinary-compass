import { CircleLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <section className="flex items-center justify-center fixed inset-0 bg-white z-10">
      <CircleLoader color="#F25C54" />
    </section>
  )
}

export default LoadingSpinner