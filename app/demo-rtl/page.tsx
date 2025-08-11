import '../../styles/rtl.css';

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function RtlDemoPage() {
  return (
    <main className="rtl-demo" dir="rtl">
      <h1>RTL Layout Demo</h1>
      <p>This page demonstrates a right-to-left layout with mirrored content.</p>
      <div className="rtl-row">
        <div className="box">First</div>
        <div className="box">Second</div>
        <div className="box">Third</div>
      </div>
    </main>
  );
}
