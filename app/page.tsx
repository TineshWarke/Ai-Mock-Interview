import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}

// export default function Home() {
//   return (
//     <div>
//       <h2 className="text-4xl">Hello world !!!</h2>
//     </div>
//   );
// }
