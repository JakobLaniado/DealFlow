require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "meetingsdk-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://marketplace.zoom.us", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"
  s.dependency "React-Core"

  s.dependency "ZoomMeetingSDK", '6.6.0'

  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386 arm64' }
  s.preserve_paths = ['MobileRTC.xcframework/**/*', 'zoomcml.xcframework/**/*']
end
