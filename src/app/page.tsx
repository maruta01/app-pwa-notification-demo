'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [notificationPermission, setNotificationPermission] = useState('default');

  // ใช้ useRef เพื่อเก็บ interval ID จะไม่ทำให้ re-render ที่ไม่จำเป็น
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const [isIntervalRunning, setIsIntervalRunning] = useState(false);

  // ตรวจสอบสถานะการอนุญาตเมื่อโหลดหน้า
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Cleanup function: จะทำงานเมื่อ component ถูก unmount (ออกจากหน้า)
    // เพื่อให้แน่ใจว่า interval จะถูกล้างออกไปเสมอ
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  // ฟังก์ชันขออนุญาตแสดง Notification
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  // ฟังก์ชันแสดง Notification ทันที
  const showNotification = () => {
    if (notificationPermission !== 'granted') {
      alert('โปรดอนุญาตการแจ้งเตือนก่อน!');
      return;
    }
    new Notification('สวัสดีจาก PWA! 👋', {
      body: 'นี่คือการแจ้งเตือนตัวอย่างจาก James Test App Alert',
      icon: '/icons/icon-192x192.png',
    });
  };

  // --- ฟังก์ชันใหม่: เริ่มการแจ้งเตือนทุก 1 นาที ---
  const startMinuteAlerts = () => {
    if (intervalIdRef.current) {
      alert('การแจ้งเตือนทุกนาทีกำลังทำงานอยู่แล้ว');
      return;
    }
    setIsIntervalRunning(true);

    // ตั้งค่าให้ alert ทำงานทุก 60,000 มิลลิวินาที (1 นาที)
    intervalIdRef.current = setInterval(() => {
      // alert('ครบ 1 นาทีแล้ว!');
      showNotification();
      // หรือจะใช้ Notification ก็ได้ ถ้าได้รับอนุญาตแล้ว
      // if (Notification.permission === 'granted') {
      //   new Notification('ครบ 1 นาทีแล้ว!', { body: 'ถึงเวลาแจ้งเตือนตามกำหนด' });
      // }
    }, 60000);
  };

  // --- ฟังก์ชันใหม่: หยุดการแจ้งเตือน ---
  const stopMinuteAlerts = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setIsIntervalRunning(false);
      alert('หยุดการแจ้งเตือนทุกนาทีแล้ว');
    }
  };

  return (
    <main className="main">
      <div className="container">
        <h1>PWA Notification & Interval Test</h1>
        <p>
          สถานะการอนุญาต: <strong>{notificationPermission}</strong>
        </p>

        {/* ส่วนของการแจ้งเตือนแบบปกติ */}
        <div className="button-group">
          <button
            onClick={requestNotificationPermission}
            disabled={notificationPermission !== 'default'}
          >
            1. ขออนุญาต
          </button>
          <button
            onClick={showNotification}
            disabled={notificationPermission !== 'granted'}
          >
            2. แสดง Notification ทันที
          </button>
        </div>

        <hr style={{ margin: '2rem 0', border: '1px solid #eee' }} />

        {/* ส่วนของการแจ้งเตือนทุกนาที */}
        <h2>ตั้งเตือนทุก 1 นาที</h2>
        <div className="button-group">
          <button onClick={startMinuteAlerts} disabled={isIntervalRunning}>
            เริ่มเตือนทุกนาที
          </button>
          <button onClick={stopMinuteAlerts} disabled={!isIntervalRunning}>
            หยุดการเตือน
          </button>
        </div>
        {isIntervalRunning && <p style={{ marginTop: '1rem', color: 'green' }}>การแจ้งเตือนกำลังทำงาน...</p>}
      </div>
    </main>
  );
}