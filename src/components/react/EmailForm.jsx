import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';

export function EmailForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!message.trim()) newErrors.message = 'Message is required';
    if (message.trim().length < 30)
      newErrors.message = 'Message must be at least 30 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);

      try {
        const templateParams = {
          name,
          email,
          message,
        };

        await emailjs.send(
          import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
          import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY
        );

        toast({
          title: 'Success!',
          description: 'Your message has been sent successfully.',
        });

        console.log('Email sent successfully!');

        // Reset form
        setName('');
        setEmail('');
        setMessage('');
        setIsOpen(false);

        // You might want to show a success toast here
      } catch (error) {
        console.error('Error sending email:', error);

        toast({
          title: 'ERROR!',
          description: 'Something went wrong. Please try again later.',
        });
        // You might want to show an error toast here
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          Email me{' '}
          <span className='relative flex h-3 w-3 ml-2'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75' />
            <span className='relative inline-flex h-3 w-3 rounded-full bg-green-500' />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Drop me a message!</DialogTitle>
          <DialogDescription>
            Fill out the form below to get in touch.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className='text-red-500 text-sm'>{errors.name}</p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email}</p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='message'>Message</Label>
              <Textarea
                id='message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              {errors.message && (
                <p className='text-red-500 text-sm'>{errors.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
