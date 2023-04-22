declare module '@calcom/embed-react' {
    interface CalConfig {
      name?: string;
      email?: string;
      notes?: string;
      guests?: string[];
      theme?: string;
    }
  
    interface CalProps {
      calLink: string;
      config?: CalConfig;
    }
  
    class Cal extends React.Component<CalProps> {}
  
    export default Cal;
  }
  