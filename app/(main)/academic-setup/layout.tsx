export default function Layout({
  children,
  subjectList,
  pricing,
  educationLevel,
}: Readonly<{
  children: React.ReactNode;
  subjectList: React.ReactNode;
  pricing: React.ReactNode;
  educationLevel: React.ReactNode;
}>) {
  return (
    <div className="flex h-full gap-4">
      <div className="flex flex-1">
        {subjectList}
      </div>

      <div className="flex flex-1 flex-col gap-4 h-full">
        <div className="flex flex-1 min-h-0">
          {/* {pricing} */}
          {educationLevel}
        </div>

        <div className="flex flex-1 min-h-0">
          {educationLevel}
        </div>
      </div>
    </div>
  );
}
