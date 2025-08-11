import { JSX } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-24">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-6 brand-gradient-text">
            Kas Teil On Küsimusi?
            <br />
            Võtke Meiega Ühendust! 💬
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oleme siin, et aidata teil leida täiuslik reis. Võtke julgelt
            ühendust - meie sõbralik meeskond vastab kõikidele küsimustele ja
            aitab planeerida unistuste puhkuse.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Kontaktivorm */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-orange-600">
              Saada Meile Sõnum
            </h2>

            <form className="space-y-6">
              {/* Nimi ja Email rida */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nimi *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    placeholder="Teie nimi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    placeholder="teie@email.ee"
                  />
                </div>
              </div>

              {/* Reisi tüüp ja sihtkoht */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reisi tüüp
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all">
                    <option value="">Valige reisi tüüp</option>
                    <option value="puhkus">Puhkus/Puhkereisi</option>
                    <option value="seiklus">Seiklus/Aktiivsed reisid</option>
                    <option value="romantiline">Romantiline reis</option>
                    <option value="pere">Perereisi</option>
                    <option value="grupp">Grupireis</option>
                    <option value="muu">Muu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eelistatud sihtkoht
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    placeholder="nt. Türgi, Egiptus, Kreeka..."
                  />
                </div>
              </div>

              {/* Sõnum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sõnum *
                </label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Kirjeldage oma soove, küsimusi või täpsustusi..."
                />
              </div>

              {/* Eelistatud vastamise aeg */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Millal on teil sobiv vastust saada?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="response_time"
                      value="asap"
                      className="text-orange-500"
                    />
                    <span className="text-sm">Nii kiiresti kui võimalik</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="response_time"
                      value="today"
                      className="text-orange-500"
                    />
                    <span className="text-sm">Täna</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="response_time"
                      value="tomorrow"
                      className="text-orange-500"
                    />
                    <span className="text-sm">Homme</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="response_time"
                      value="week"
                      className="text-orange-500"
                    />
                    <span className="text-sm">Nädala jooksul</span>
                  </label>
                </div>
              </div>

              {/* Submit nupp */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Saada Sõnum
              </button>
            </form>
          </div>

          {/* Kontaktinfo */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-orange-600">
              Kontaktandmed
            </h2>

            <div className="space-y-6">
              {/* Firma info */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Firma Info
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p className="font-medium">Eksootikareisid OÜ</p>
                  <p>Registrikood: 16761764</p>
                  <p>KMKR: EE102631364</p>
                </div>
              </div>

              {/* Kontaktdetailid */}
              <div className="grid grid-cols-1 gap-4">
                {/* Telefon */}
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Telefon</h4>
                    <p className="text-gray-600">+372 55588580</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Broneeringud
                    </h4>
                    <p className="text-gray-600">info@eksootikareisid.ee</p>
                  </div>
                </div>

                {/* Aadress */}
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Aadress</h4>
                    <p className="text-gray-600">
                      Nigula tee 51, Eametsa küla,
                      <br />
                      Tori vald, Pärnumaa 85001
                    </p>
                  </div>
                </div>

                {/* Töötunnid */}
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Töötunnid</h4>
                    <p className="text-gray-600">E-P 9:00-22:00</p>
                  </div>
                </div>
              </div>

              {/* Reisiagentide kontaktid */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Küsi Pakkumist
                </h3>
                <div className="space-y-4">
                  {/* Reisiagent Anette */}
                  <div className="border-b border-gray-200 pb-3">
                    <h4 className="font-medium text-gray-800 mb-1">
                      Reisiagent Anette
                    </h4>
                    <a
                      href="mailto:anette@eksootikareisid.ee"
                      className="text-orange-600 hover:text-orange-700 transition-colors text-sm"
                    >
                      anette@eksootikareisid.ee
                    </a>
                  </div>

                  {/* Reisiagent Gretemari */}
                  <div className="border-b border-gray-200 pb-3">
                    <h4 className="font-medium text-gray-800 mb-1">
                      Reisiagent Gretemari
                    </h4>
                    <a
                      href="mailto:gretemari@eksootikareisid.ee"
                      className="text-orange-600 hover:text-orange-700 transition-colors text-sm"
                    >
                      gretemari@eksootikareisid.ee
                    </a>
                  </div>

                  {/* Reisiagent Ranele */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Reisiagent Ranele
                    </h4>
                    <div className="space-y-1">
                      <a
                        href="mailto:ranele@eksootikareisid.ee"
                        className="block text-orange-600 hover:text-orange-700 transition-colors text-sm"
                      >
                        ranele@eksootikareisid.ee
                      </a>
                      <p className="text-gray-600 text-sm">+372 555 88 580</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
