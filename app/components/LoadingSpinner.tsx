import { CircleLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <section className="flex items-center justify-center absolute inset-0 bg-white z-10 mt-[73px]">
      <CircleLoader color="#F25C54" />
    </section>
  )
}

export default LoadingSpinner