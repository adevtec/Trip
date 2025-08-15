import { JSX } from "react";

export default function AboutUsPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center brand-gradient-text">
          Eksootikareisid OÜ – Sinu tee unistuste sihtkohtadesse 🌴✈️
        </h1>

        <div className="prose prose-orange max-w-none">
          {/* Sissejuhatus */}
          <section className="mb-8">
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Kas sul on mõni sihtkoht, mis juba ammu südames kutsub? Soojad
                rannad, kus päike paitab nahka… Metsik loodus, mis avab end igal
                sammul… Või hoopis suurlinnad, kus iga tänavanurk peidab uusi
                avastusi?
              </p>
              <p>
                <strong>Eksootikareisid OÜ</strong> aitab muuta unistused
                tõelisuseks. Meie jaoks ei ole reis lihtsalt pilet ja hotell –
                see on lugu, mille elad ise läbi.
              </p>
            </div>
          </section>

          {/* Mida me pakume */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-orange-600">
              Mida me pakume?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl">✨</span>
                <p>
                  <strong>Elamusi, mis jäävad meelde kogu eluks</strong> –
                  alates romantilistest päikeseloojangutest Vahemere ääres kuni
                  hingematvate seiklusteni Aasias ja Ameerikas.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl">✨</span>
                <p>
                  <strong>Muretut reisimist</strong> – meie hoolitseme detailide
                  eest, sina naudid hetke.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl">✨</span>
                <p>
                  <strong>Personaalse lähenemisega nõustamist</strong> – me
                  kuulame sind ja aitame luua just sinu soovidele vastava
                  puhkuse.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl">✨</span>
                <p>
                  <strong>Täielikku kindlustunnet</strong> – koostöös SALVA
                  Kindlustusega pakume sulle turvatunnet igas olukorras.
                </p>
              </div>
            </div>
          </section>

          {/* Miks meie */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-orange-600">
              Miks meie?
            </h2>
            <div className="bg-orange-50 rounded-lg p-6 space-y-4">
              <p>
                Meie kliendid ütlevad, et nad valivad meid, sest tunnevad, et
                nad pole lihtsalt järjekordne broneering. Meie jaoks oled sa
                külaline, kes väärib parimat.
              </p>
              <p>
                Meie töö on panna sind tundma, et iga reis algab juba siis, kui
                hakkad seda planeerima.
              </p>
            </div>
          </section>

          {/* Üleskutse */}
          <section className="mb-8">
            <div className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-8">
              <p className="text-xl font-semibold mb-2">
                Alusta oma unistuste seiklust juba täna
              </p>
              <p className="text-lg opacity-90">
                – sest parim aeg reisimiseks on alati nüüd.
              </p>
            </div>
          </section>

          {/* Koostööpartnerid */}
          <section className="mb-8">
            <details className="group">
              <summary className="cursor-pointer font-semibold text-gray-700 hover:text-orange-600 transition-colors list-none">
                <span>Meie partnerid</span>
              </summary>
              <div className="mt-4 pt-4 bg-gray-50 rounded-lg p-4 border-t border-gray-200">
                <p className="mb-3 text-gray-700">
                  Eksootikareisid OÜ on ametlikult volitatud edasimüüja
                  järgmistele reisikorraldajatele:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    TEZ Tour
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    JoinUp
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Coral Travel Estonia
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Anex Tour Eesti
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Novatours
                  </li>
                </ul>
              </div>
            </details>
          </section>
        </div>
      </div>
    </div>
  );
}
