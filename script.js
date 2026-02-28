const input = document.getElementById("zipInput");
const statusText = document.getElementById("status");

input.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  statusText.innerText = "Processing...";

  const zip = await JSZip.loadAsync(file);
  const newZip = new JSZip();

  const removePatterns = [
    /^build\//,
    /^\.dart_tool\//,
    /^\.gradle\//,
    /^ios\/Pods\//,
    /^\.idea\//,
    /\.iml$/,
    /^app\/build\//,
    /^\.cxx\//,
    /^local\.properties$/,
    /\.lock$/,
  ];

  const files = Object.keys(zip.files);

  for (let filename of files) {
    let shouldRemove = removePatterns.some(pattern =>
      pattern.test(filename)
    );

    if (!shouldRemove) {
      const content = await zip.files[filename].async("arraybuffer");
      newZip.file(filename, content);
    }
  }

  const blob = await newZip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 9 }
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "cleaned_project.zip";
  link.click();

  statusText.innerText = "Done! 🚀";
});