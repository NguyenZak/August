const fs = require('fs');
const path = '/Users/apple/Documents/ViZ Solutions/Facebook Toolzz/frontend/src/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldSection = `      {/* About Section */}
      <section id="about" className="py-32 md:py-48 bg-[#F5F5F5] text-black rounded-t-[3rem] -mt-10 relative z-20">
        <div className="max-w-[95%] mx-auto px-6">
          <p className="text-2xl font-serif italic mb-16 opacity-60">về chúng tôi.</p>
          <div className="max-w-7xl">
            <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-black lowercase leading-[0.9] tracking-tighter">
              chúng tôi xây dựng công cụ, để bạn tập trung vào sáng tạo.
            </h2>
            <p className="mt-16 text-3xl md:text-4xl max-w-4xl font-medium text-gray-500 lowercase leading-tight">
              thay đổi hoàn toàn cách bạn vận hành dịch vụ marketing mạng xã hội. nhanh hơn, hiệu quả hơn và chuyên nghiệp hơn.
            </p>
          </div>
        </div>
      </section>`;

const newSection = `      {/* About Section */}
      <section id="about" className="py-32 md:py-48 bg-[#F5F5F5] text-black rounded-t-[3rem] -mt-10 relative z-20 overflow-hidden">
        <div className="max-w-[95%] mx-auto px-6">
          <p className="text-2xl font-serif italic mb-16 opacity-60">về chúng tôi.</p>
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 max-w-4xl">
              <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-black lowercase leading-[0.9] tracking-tighter">
                chúng tôi xây dựng công cụ, để bạn tập trung vào sáng tạo.
              </h2>
              <p className="mt-16 text-3xl md:text-4xl max-w-4xl font-medium text-gray-500 lowercase leading-tight">
                thay đổi hoàn toàn cách bạn vận hành dịch vụ marketing mạng xã hội. nhanh hơn, hiệu quả hơn và chuyên nghiệp hơn.
              </p>
            </div>
            <div className="w-full md:w-[35%] aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl flex-shrink-0 animate-[float_12s_ease-in-out_infinite]">
              <img src="/assets/august/about_center_1.jpg" alt="About August" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>`;

if (content.includes(oldSection)) {
    content = content.replace(oldSection, newSection);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Success: About section updated.');
} else {
    console.log('Error: old section not found.');
}
