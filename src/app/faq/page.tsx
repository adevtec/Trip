import { JSX } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center gradient-text">
          Korduma Kippuvad Küsimused ❓
        </h1>

        <div className="prose prose-orange max-w-none">
          <div className="mb-6 text-lg text-gray-600 text-center">
            Siit leiate vastused kõige sagedamini küsitud küsimustele. Kui ei
            leia vastust oma küsimusele, võtke julgelt{" "}
            <a
              href="/contact"
              className="text-orange-600 hover:text-orange-700"
            >
              ühendust
            </a>
            .
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="group bg-gray-50 rounded-lg">
              <summary className="cursor-pointer p-6 flex justify-between items-center font-semibold text-gray-800 hover:text-orange-600 transition-colors list-none">
                <span>Kui kaugelt ette tuleb reisi broneerida?</span>
                <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform text-orange-500" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-gray-600 border-t border-gray-200 mt-4">
                <p>
                  Soovitame broneerida vähemalt 2-4 nädalat enne reisi algust.
                  Populaarsed sihtkohad ja kõrghooajal võivad täituda kiiremini,
                  seega varasem broneering tagab parema valiku ja hinnad. Last
                  minute pakkumised on saadaval 1-2 nädalat enne väljumist.
                </p>
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="group bg-gray-50 rounded-lg">
              <summary className="cursor-pointer p-6 flex justify-between items-center font-semibold text-gray-800 hover:text-orange-600 transition-colors list-none">
                <span>Millised dokumendid on reisimiseks vajalikud?</span>
                <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform text-orange-500" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-gray-600 border-t border-gray-200 mt-4">
                <p className="mb-2">Dokumentide vajadus sõltub sihtkohast:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Euroopa Liit:</strong> Kehtiv ID-kaart või pass
                  </li>
                  <li>
                    <strong>Türgi, Egiptus:</strong> Kehtiv pass (vähemalt 6
                    kuud)
                  </li>
                  <li>
                    <strong>Eksootilised sihtkohad:</strong> Pass + vajadusel
                    viisa
                  </li>
                </ul>
                <p className="mt-2">
                  Kontrollime alati konkreetse sihtkoha nõudeid ja informeerime
                  teid broneeringu kinnitamisel.
                </p>
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="group bg-gray-50 rounded-lg">
              <summary className="cursor-pointer p-6 flex justify-between items-center font-semibold text-gray-800 hover:text-orange-600 transition-colors list-none">
                <span>Kas saab reisi tühistada või muuta?</span>
                <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform text-orange-500" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-gray-600 border-t border-gray-200 mt-4">
                <p>
                  Jah, reisi saab tühistada või muuta, kuid tingimused sõltuvad
                  broneeringu tingimustest ja ajast:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>
                    Tasuta tühistamine tavaliselt 14-21 päeva enne väljumist
                  </li>
                  <li>Muudatused võivad kaasa tuua lisatasusid</li>
                  <li>Tühistuskulud kasvavad väljumise ajale lähenedes</li>
                </ul>
                <p className="mt-2">
                  Soovitame alati reisikindlustust, mis katab ettenägematud
                  olukorrad.
                </p>
              </div>
            </details>

            {/* FAQ 4 */}
            <details className="group bg-gray-50 rounded-lg">
              <summary className="cursor-pointer p-6 flex justify-between items-center font-semibold text-gray-800 hover:text-orange-600 transition-colors list-none">
                <span>Milline on teie maksekord?</span>
                <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform text-orange-500" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-gray-600 border-t border-gray-200 mt-4">
                <p className="mb-2">Pakume paindlikke makseviise:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Broneeringu kinnitamisel:</strong> 30-50% ettemaks
                  </li>
                  <li>
                    <strong>Lõppmakse:</strong> 14-21 päeva enne reisi
                  </li>
                  <li>
                    <strong>Makseviisid:</strong> Pangaülekanne, kaardimakse
                  </li>
                  <li>
                    <strong>Järelmaks:</strong> Võimalik koostöös pankadega
                  </li>
                </ul>
              </div>
            </details>

            {/* FAQ 5 */}
            <details className="group bg-gray-50 rounded-lg">
              <summary className="cursor-pointer p-6 flex justify-between items-center font-semibold text-gray-800 hover:text-orange-600 transition-colors list-none">
                <span>Kas hinnad sisaldavad kõiki kulusid?</span>
                <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform text-orange-500" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-gray-600 border-t border-gray-200 mt-4">
                <p className="mb-2">Meie hinnad sisaldavad:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Lennud edasi-tagasi</li>
                  <li>Majutus valitud toitlustusega</li>
                  <li>Lennujaama üleveod</li>
                  <li>Reisiekspert kohapeal</li>
                </ul>
                <p className="mt-2">
                  <strong>Lisaks võivad olla vajalikud:</strong> viisa (kui
                  nõutav), reisikindlustus, isiklikud kulud, ekskursioonid.
                </p>
              </div>
            </details>

            {/* FAQ 6 */}
            <details className="group bg-gray-50 rounded-lg">
              <summary className="cursor-pointer p-6 flex justify-between items-center font-semibold text-gray-800 hover:text-orange-600 transition-colors list-none">
                <span>Millised on teie partnerfirmad?</span>
                <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform text-orange-500" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-gray-600 border-t border-gray-200 mt-4">
                <p className="mb-2">
                  Oleme ametlikult volitatud edasimüüjad järgmistele
                  usaldusväärsetele reisikorraldajatele:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>TEZ Tour</li>
                  <li>JoinUp</li>
                  <li>Coral Travel Estonia</li>
                  <li>Anex Tour Eesti</li>
                  <li>Novatours</li>
                </ul>
                <p className="mt-2">
                  Kõik meie partnerid on tunnustatud reisikorraldajad
                  pikaajalise kogemusega.
                </p>
              </div>
            </details>

            {/* FAQ 7 */}
            <details className="group bg-gray-50 rounded-lg">
              <summary className="cursor-pointer p-6 flex justify-between items-center font-semibold text-gray-800 hover:text-orange-600 transition-colors list-none">
                <span>Kuidas saada reisil abi, kui midagi juhtub?</span>
                <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform text-orange-500" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-gray-600 border-t border-gray-200 mt-4">
                <p className="mb-2">Oleme alati teie toeks:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>24/7 hädaabi:</strong> +372 53019999
                  </li>
                  <li>
                    <strong>Kohalik reisiekspert:</strong> Igal sihtkohel
                  </li>
                  <li>
                    <strong>Meie kontor:</strong> +372 55588580 (E-P 9:00-22:00)
                  </li>
                  <li>
                    <strong>Email tugi:</strong> info@eksootikareisid.ee
                  </li>
                </ul>
              </div>
            </details>

            {/* FAQ 8 */}
            <details className="group bg-gray-50 rounded-lg">
              <summary className="cursor-pointer p-6 flex justify-between items-center font-semibold text-gray-800 hover:text-orange-600 transition-colors list-none">
                <span>Kas pakute ka individuaalseid reise?</span>
                <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform text-orange-500" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-gray-600 border-t border-gray-200 mt-4">
                <p>
                  Jah! Kõrvuti grupireisidega koostame ka individuaalseid
                  reisiplaane. Räägime teie soovidest, eelarve ja ootustest ning
                  planeerime just teile sobiva reisi.
                  <a
                    href="/contact"
                    className="text-orange-600 hover:text-orange-700"
                  >
                    Võtke ühendust
                  </a>
                  , et arutada oma unistuste reisi üle.
                </p>
              </div>
            </details>
          </div>

          {/* Kontakt sektsioon */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Ei leidnud vastust oma küsimusele?
            </h2>
            <p className="mb-4 opacity-90">
              Meie sõbralik meeskond on valmis aitama!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-orange-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Saada Sõnum
              </a>
              <a
                href="tel:+37255588580"
                className="bg-white/20 text-white font-semibold py-2 px-6 rounded-lg hover:bg-white/30 transition-colors"
              >
                Helista: +372 55588580
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
