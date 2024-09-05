export default function Layout({
    children,
    subjectList,
    pricing,
    levelList,
  }: Readonly<{
    children: React.ReactNode;
    subjectList: React.ReactNode;
    pricing: React.ReactNode;
    levelList: React.ReactNode;
  }>) {
    return (
      <div className="flex h-full gap-4">
        <div className="flex flex-1">
          {subjectList}
        </div>
  
        <div className="flex flex-1 flex-col gap-4 h-full">
          <div className="flex flex-1 min-h-0">
            {levelList}
          </div>
        </div>
      </div>
    );
  }
  