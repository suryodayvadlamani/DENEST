function KPI({ label, value }) {
  return (
    <div className=" bg-gradient-to-tr dark:text-white pt-2 rounded-sm w-32 justify-center text-center text-sm text-black">
      <span> {label}</span>
      <br />
      <span className="text-lg font-bold">{value || 0}</span>
    </div>
  );
}

export default KPI;
