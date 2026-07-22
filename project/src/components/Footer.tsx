import { ChefHat, Heart, Mail, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/10 bg-slate-900/40 py-10">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <ChefHat className="h-5 w-5 text-white" />
              </div>

              <h2 className="font-display text-xl font-bold">
                ChefMate
              </h2>
            </div>

            <p className="mt-4 text-sm text-slate-400">
              AI-powered recipe generator that creates delicious meals
              from the ingredients you already have.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary-500">Home</a></li>
              <li><a href="#" className="hover:text-primary-500">Generate Recipe</a></li>
              <li><a href="#" className="hover:text-primary-500">About</a></li>
              <li><a href="#" className="hover:text-primary-500">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 font-semibold text-white">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-slate-400">

              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>support@chefmate.ai</span>
              </div>

              <div className="flex gap-4 pt-2">
                <Github
                  className="cursor-pointer hover:text-primary-500"
                  size={18}
                />
                <Linkedin
                  className="cursor-pointer hover:text-primary-500"
                  size={18}
                />
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 border-t border-slate-700 pt-5 text-center text-sm text-slate-400">
          <p className="flex items-center justify-center gap-1">
            Made with
            <Heart className="h-4 w-4 fill-primary-500 text-primary-500" />
            for home chefs.
          </p>

          <p className="mt-2">
            © {new Date().getFullYear()} ChefMate. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}