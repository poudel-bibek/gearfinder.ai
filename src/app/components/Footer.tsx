export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-green-100">&copy; {new Date().getFullYear()} Gearfinder. All rights reserved.</p>
      </div>
    </footer>
  )
}

